import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ChatRoomService } from "../../adapter/chatRoom/service";
import { WSSocket } from "../socket.service";
import { Server, Socket } from "socket.io";
import { ChatRoomEntity, RoomType } from "../../modules/database/chatRoom/entity";
import { UserService } from "../../adapter/user/service";
import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";
import { Sanitize } from "../../modules/database/sanitize-object";
import { BrcyptWrap } from "../../addons/bcrypt.wrapper";
import { UserMetricsService } from "../../modules/database/metrics/service";

export enum RoomAction {
	KICK,
	PROMOTE,
	DEMOTE,
	OWNERSHIP,
	UNBAN,
	BAN,
	UNMUTE,
}

@Injectable()
export class WSChatChannelService {
	constructor(
		private sanitize: Sanitize,
		private chatRoomService: ChatRoomService,
		private userService: UserService,
		private dbUserChatRoomService: DBUserChatRoomService,
		private bcryptWrap: BrcyptWrap,
		private metricsService: UserMetricsService,
		public wsSocket: WSSocket,
	) {}

	async getAllAvailableChannelRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		var all_channel =
			await this.chatRoomService.getAllAvailableChannelRoom();

		for (var i = 0; i < all_channel.length; i++) {
			all_channel[i].roomInfo.forEach((item) => {
				if (item.userId === user_id) delete all_channel[i];
			});
		}

		all_channel = all_channel.filter((data) => {
			return data != null;
		});

		if (all_channel.length === 0 || all_channel[0] === null) return;
		socket.emit(
			"getAllAvailableChannelRoom",
			this.sanitize.ChatRooms(all_channel),
		);
	}

	async getAllJoinedChannelRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const all_joined_room =
			await this.chatRoomService.getAllJoinedChannelRoom(user_id);
		const all_joined: ChatRoomEntity[] = [];

		for (let i = 0; i < all_joined_room.length; i++) {
			all_joined.push(
				await this.chatRoomService.getJoinedChannelRoom(
					all_joined_room[i].id,
				),
			);
		}
		socket.emit(
			"getAllJoinedChannelRoom",
			this.sanitize.ChatRooms(all_joined),
		);
	}

	async createChannelRoom(
		server: Server,
		socket: Socket,
		name: string,
		password: string,
		is_private: boolean,
		user_ids: number[],
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room_id = await this.chatRoomService.createChannelRoomAddUser(
			user_id,
			name,
			password,
			is_private,
			user_ids,
		);
		if (!is_private)
		{
			const available_room =
				await this.chatRoomService.getAvailableChannelRoom(room_id);
			this.wsSocket.sendToAllSocket(
				server,
				"getNewAvailableChannelRoom",
				this.sanitize.ChatRoom(available_room),
			);
		}
		const joined_room = await this.chatRoomService.getJoinedChannelRoom(
			room_id,
		);
		user_ids.push(user_id);
		this.wsSocket.sendToUsers(
			server,
			user_ids,
			"getNewJoinedChannelRoom",
			this.sanitize.ChatRoom(joined_room),
		);
	}

	async joinChannelRoom(
		server: Server,
		socket: Socket,
		room_id: number,
		password: string,
	) {
		var room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		const user_id = this.wsSocket.getUserId(socket.id);
		const current_user_chatroom = await this.chatRoomService.getUserChatRoom(
			user_id,
			room.id,
		)
			.catch((err) => {});

		if (current_user_chatroom && current_user_chatroom.isBanned)
		{
			const user = current_user_chatroom.user;
			console.log(`${user.ftLogin} (${user.nickname}) banned from`,
				`${room.name} (${room.id})`);
			return ;
		}
		const user = await this.chatRoomService.getAllUserFromRoom(room_id);
		var not_good_pass: boolean = false;
		user.forEach((item) => {
			if (item === user_id) return;
		});
		if (room.type === RoomType.PROTECTED) {
			if (!password || password === "") not_good_pass = true;
			else {
				const isMatch = await this.bcryptWrap.compare(password, room.password);
				if (!isMatch) not_good_pass = true;
			}
		}
		if (not_good_pass) return new UnauthorizedException("Wrong Password");
		await this.chatRoomService.joinChannelRoom(room.id, user_id);
		room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		const user_chatroom = await this.chatRoomService.getUserChatRoom(
			user_id,
			room.id,
		);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewJoinedChannelRoom",
			this.sanitize.ChatRoom(room),
		);
		this.wsSocket.sendToUserInRoom(
			server,
			room,
			"getNewUserJoinChannelRoom",
			this.sanitize.UserChatRoom(user_chatroom),
		);
	}

	async sendGlobalMessage(
		server: Server,
		socket: Socket,
		dst_id: number,
		message: string,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		var not_in_room: boolean = false;
		const user_chatroom = await this.chatRoomService
			.getUserChatRoom(user_id, dst_id)
			.catch((err) => {
				not_in_room = true;
			});
		if (not_in_room) return;
		if (!user_chatroom || user_chatroom.isBanned) return;
		if (user_chatroom.isMuted) {
			if (user_chatroom.demuteDate < new Date())
				await this.takeRoomAction(
					server,
					socket,
					user_chatroom.roomId,
					RoomAction.UNMUTE,
					user_id,
				);
			else {
				console.log(
					`${user_chatroom.user.ftLogin} (${user_chatroom.user.nickname})`,
					"muted",
				);
				return;
			}
		}
		const message_id = await this.chatRoomService.sendMessage(
			dst_id,
			user_id,
			message,
		);
		const new_message = await this.chatRoomService.getMessage(message_id);
		const all_user = await this.chatRoomService.getAllUserFromRoom(dst_id);

		this.wsSocket.sendToUsers(server, all_user, "getNewGlobalMessage", {
			room_id: dst_id,
			message: this.sanitize.Message(new_message),
		});
	}

	async changeRoomDetailParse(detail: any) {
		const details: any = {};

		if (detail.name && detail.name !== "") details["name"] = detail.name;
		if (
			detail.remove_pass === true ||
			(detail.change_private === true && detail.is_private)
		)
			details["password"] = "";
		else if (detail.password && detail.password !== "")
			details["password"] = await this.bcryptWrap.hash(detail.password);
		return details;
	}

	async changeRoomDetailsIsChanged(
		details: any,
		detail: any,
		room: ChatRoomEntity,
	) {
		var changed = 0;

		if (details.name && details.name !== room.name) changed = 2;
		if (detail.change_private) {
			changed = changed === 2 ? 2 : 1;
			if (detail.is_private && room.type !== RoomType.PRIVATE)
				await this.chatRoomService.updateType(
					room.id,
					RoomType.PRIVATE,
				);
			else
				await this.chatRoomService.updateType(room.id, RoomType.PUBLIC);
		}
		if (detail.remove_pass && room.type === RoomType.PROTECTED) {
			changed = 2;
			await this.chatRoomService.updateType(room.id, RoomType.PUBLIC);
		} else if (
			details.password &&
			(room.type === RoomType.PUBLIC || room.type === RoomType.PRIVATE)
		) {
			changed = 2;
			await this.chatRoomService.updateType(room.id, RoomType.PROTECTED);
		}
		return changed;
	}

	async changeRoomDetails(
		server: Server,
		socket: Socket,
		room_id: number,
		detail: any,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		let room = await this.chatRoomService.getJoinedChannelRoom(room_id);

		if (!this.isOwner(room, user_id)) return;
		const details: any = await this.changeRoomDetailParse(detail);
		const changed: number = await this.changeRoomDetailsIsChanged(
			details,
			detail,
			room,
		);

		if (changed > 0) {
			if (changed === 2)
				await this.chatRoomService.changeRoomDetails(room_id, details);
			room = await this.chatRoomService.getJoinedChannelRoom(room_id);
			this.wsSocket.sendToUserInRoom(
				server,
				room,
				"getNewDetailsChannelRoom",
				this.sanitize.ChatRoom(room),
			);
		}
	}

	async addUserToRoom(
		server: Server,
		socket: Socket,
		room_id: number,
		user_ids: number[],
	) {
		var room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		var parsed_user_ids: number[] = [];
		if (!this.isAdmin(room, this.wsSocket.getUserId(socket.id))) return;
		for (var i = 0; i < user_ids.length; i++) {
			const user_chatroom = await this.chatRoomService
				.getUserChatRoom(user_ids[i], room_id)
				.catch((err) => {
					parsed_user_ids.push(user_ids[i]);
				});
			if (user_chatroom && !user_chatroom.isBanned)
				parsed_user_ids.push(user_ids[i]);
		}
		for (var i = 0; i < user_ids.length; i++)
			await this.chatRoomService.joinChannelRoom(room_id, user_ids[i]);

		room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		var user_list = await this.chatRoomService.getAllUserFromRoom(room_id);
		this.wsSocket.sendToUsers(
			server,
			parsed_user_ids,
			"getNewJoinedChannelRoom",
			this.sanitize.ChatRoom(room),
		);
		for (var i = 0; i < user_list.length; i++)
			for (var j = 0; j < parsed_user_ids.length; j++)
				if (user_list[i] === parsed_user_ids[j]) user_list.splice(i, 1);
		for (var i = 0; i < parsed_user_ids.length; i++) {
			const user = this.sanitize.User(
				await this.userService.getInfoById(parsed_user_ids[i]),
			);
			this.wsSocket.sendToUsers(
				server,
				user_list,
				"getNewUserJoinChannelRoom",
				{
					userId: parsed_user_ids[i],
					roomId: room.id,
					isOwner: false,
					isAdmin: false,
					user: user,
				},
			);
		}
	}

	async leaveRoom(
		server: Server,
		socket: Socket,
		room_id: number,
		target_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room = await this.chatRoomService.getJoinedChannelRoom(room_id);

		if (user_id !== target_id) return;

		await this.chatRoomService.kickUser(room_id, target_id);
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.KICK,
			target_id: target_id,
			room_id: room.id,
		});
	}

	canTakeAction(
		room: ChatRoomEntity,
		user_id: number,
		target_id: number,
		action: RoomAction,
	): boolean {
		let result = false;

		if (this.isOwner(room, target_id)) return false;
		switch (action) {
			case RoomAction.PROMOTE:
			case RoomAction.DEMOTE:
			case RoomAction.OWNERSHIP: {
				result = this.isOwner(room, user_id);
				break;
			}

			case RoomAction.KICK:
			case RoomAction.UNBAN:
			case RoomAction.BAN:
			case RoomAction.UNBAN:
			case RoomAction.UNMUTE: {
				result = this.isAdmin(room, user_id);
				break;
			}
		}
		return result;
	}

	async kickUser(room: ChatRoomEntity, target_id: number) {
		this.chatRoomService.kickUser(room.id, target_id);
	}

	async giveKrown(user_id: number, room: ChatRoomEntity, target_id: number) {
		if (user_id !== target_id)
			this.chatRoomService.giveKrownUser(user_id, room.id, target_id);
	}

	async promoteUser(room: ChatRoomEntity, target_id: number) {
		await this.dbUserChatRoomService.update(target_id, room.id, {
			isAdmin: true,
		});
	}

	async demoteUser(room: ChatRoomEntity, target_id: number) {
		await this.dbUserChatRoomService.update(target_id, room.id, {
			isAdmin: false,
		});
	}

	async ban(room: ChatRoomEntity, target_id: number) {
		await this.dbUserChatRoomService.update(target_id, room.id, {
			isAdmin: false,
			isBanned: true,
		});
	}

	async unban(room: ChatRoomEntity, target_id: number) {
		await this.dbUserChatRoomService.update(target_id, room.id, {
			isBanned: false,
		});
	}

	async unmute(room: ChatRoomEntity, target_id: number) {
		await this.dbUserChatRoomService.update(target_id, room.id, {
			isMuted: false,
			demuteDate: new Date(),
		});
	}

	takeAction(
		user_id: number,
		room: ChatRoomEntity,
		target_id: number,
		action: RoomAction,
	) {
		switch (action) {
			case RoomAction.KICK: {
				this.kickUser(room, target_id);
				break;
			}

			case RoomAction.DEMOTE: {
				this.demoteUser(room, target_id);
				break;
			}

			case RoomAction.PROMOTE: {
				this.promoteUser(room, target_id);
				break;
			}

			case RoomAction.OWNERSHIP: {
				this.giveKrown(user_id, room, target_id);
				break;
			}

			case RoomAction.BAN: {
				this.ban(room, target_id);
				break;
			}

			case RoomAction.UNBAN: {
				this.unban(room, target_id);
				break;
			}

			case RoomAction.UNMUTE: {
				this.unmute(room, target_id);
				break;
			}
		}
	}

	emitKick(server: Server, room: ChatRoomEntity, target_id: number) {
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.KICK,
			target_id: target_id,
			room_id: room.id,
		});
	}

	emitPromote(server: Server, room: ChatRoomEntity, target_id: number) {
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.PROMOTE,
			target_id: target_id,
			room_id: room.id,
		});
	}

	emitDemote(server: Server, room: ChatRoomEntity, target_id: number) {
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.DEMOTE,
			target_id: target_id,
			room_id: room.id,
		});
	}

	emitGiveKrown(
		server: Server,
		user_id: number,
		room: ChatRoomEntity,
		target_id: number,
	) {
		if (user_id !== target_id)
			this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
				action: RoomAction.OWNERSHIP,
				target_id: target_id,
				user_id: user_id,
				room_id: room.id,
			});
	}

	emitBan(server: Server, room: ChatRoomEntity, target_id: number) {
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.BAN,
			target_id: target_id,
			room_id: room.id,
		});
	}

	async emitUnban(server: Server, room: ChatRoomEntity, target_id: number) {
		var user_list: number[] = [];

		for (var i = 0; i < room.roomInfo.length; i++)
			if (room.roomInfo[i].userId !== target_id)
				user_list.push(room.roomInfo[i].userId);
		this.wsSocket.sendToUsers(server, user_list, "roomAction", {
			action: RoomAction.UNBAN,
			target_id: target_id,
			room_id: room.id,
		});

		const chatroom = await this.chatRoomService.getJoinedChannelRoom(
			room.id,
		);
		this.wsSocket.sendToUser(
			server,
			target_id,
			"getNewJoinedChannelRoom",
			this.sanitize.ChatRoom(chatroom),
		);
	}

	emitUnmute(server: Server, room: ChatRoomEntity, target_id: number) {
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.UNMUTE,
			target_id: target_id,
			room_id: room.id,
		});
	}

	actionEmit(
		server: Server,
		user_id: number,
		room: ChatRoomEntity,
		action: RoomAction,
		target_id: number,
	) {
		switch (action) {
			case RoomAction.KICK: {
				this.emitKick(server, room, target_id);
				break;
			}
			case RoomAction.PROMOTE: {
				this.emitPromote(server, room, target_id);
				break;
			}
			case RoomAction.DEMOTE: {
				this.emitDemote(server, room, target_id);
				break;
			}
			case RoomAction.OWNERSHIP: {
				this.emitGiveKrown(server, user_id, room, target_id);
				break;
			}
			case RoomAction.BAN: {
				this.emitBan(server, room, target_id);
				break;
			}
			case RoomAction.UNBAN: {
				this.emitUnban(server, room, target_id);
				break;
			}
			case RoomAction.UNMUTE: {
				this.emitUnmute(server, room, target_id);
				break;
			}
		}
	}

	getRoomActionStr(action: RoomAction) {
		switch (action) {
			case RoomAction.KICK:
				return `(${RoomAction.KICK}) KICK`;
			case RoomAction.PROMOTE:
				return `(${RoomAction.PROMOTE}) PROMOTE`;
			case RoomAction.DEMOTE:
				return `(${RoomAction.DEMOTE}) DEMOTE`;
			case RoomAction.OWNERSHIP:
				return `(${RoomAction.OWNERSHIP}) OWNERSHIP`;
			case RoomAction.UNBAN:
				return `(${RoomAction.UNBAN}) UNBAN`;
			case RoomAction.BAN:
				return `(${RoomAction.BAN}) BAN`;
			case RoomAction.UNMUTE:
				return `(${RoomAction.UNMUTE}) UNMUTE`;
		}
		return "UNKNOWN";
	}

	async takeRoomAction(
		server: Server,
		socket: Socket,
		room_id: number,
		action: RoomAction,
		target_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room = await this.chatRoomService.getJoinedChannelRoom(room_id);

		if (!this.canTakeAction(room, user_id, target_id, action)) {
			const user = await this.userService.getInfoById(user_id);
			const target = await this.userService.getInfoById(user_id);
			console.log(
				`[WS:ChatChannel] ${
					user.nickname
				} cannot do ${this.getRoomActionStr(action)} in ${
					room.name
				} to ${target.nickname}`,
			);
			return;
		}
		this.takeAction(user_id, room, target_id, action);
		this.actionEmit(server, user_id, room, action, target_id);
	}

	async muteUser(
		server: Server,
		socket: Socket,
		room_id: number,
		target_id: number,
		muted_time: number,
	) {
		if (!muted_time) return;
		const user_id = this.wsSocket.getUserId(socket.id);
		const room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		if (!this.isAdmin(room, user_id) && !this.isAdmin(room, user_id))
			return;
		await this.dbUserChatRoomService.mute(target_id, room.id, muted_time);
		this.wsSocket.sendToUserInRoom(
			server,
			room,
			"channelMute",
			this.sanitize.UserChatRoom(
				await this.dbUserChatRoomService.getUserChatRoom(
					room.id,
					target_id,
				),
			),
		);
	}

	isOwner(room: ChatRoomEntity, user_id: number): boolean {
		for (let i = 0; i < room.roomInfo.length; i++) {
			if (room.roomInfo[i].userId === user_id && room.roomInfo[i].isOwner)
				return true;
		}
		return false;
	}

	isAdmin(room: ChatRoomEntity, user_id: number): boolean {
		if (this.isOwner(room, user_id)) return true;
		for (let i = 0; i < room.roomInfo.length; i++) {
			if (room.roomInfo[i].userId === user_id && room.roomInfo[i].isAdmin)
				return true;
		}
		return false;
	}
}
