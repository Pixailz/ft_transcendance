import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSSocket } from "../socket.service";
import { Server, Socket } from "socket.io";
import { ChatRoomEntity, RoomType } from "src/modules/database/chatRoom/entity";
import * as bcrypt from "bcrypt";
import { Sanitize } from "../../sanitize-object";
import { UserService } from "src/adapter/user/service";

export enum RoomAction {
	KICK,
	PROMOTE,
	OWNERSHIP,
}

@Injectable()
export class WSChatChannelService {
	constructor(
		private sanitize: Sanitize,
		private chatRoomService: ChatRoomService,
		private userService: UserService,
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
		user_ids: number[],
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room_id = await this.chatRoomService.createChannelRoomAddUser(
			user_id,
			name,
			password,
			user_ids,
		);
		const available_room =
			await this.chatRoomService.getAvailableChannelRoom(room_id);
		const joined_room = await this.chatRoomService.getJoinedChannelRoom(
			room_id,
		);
		this.wsSocket.sendToAllSocket(
			server,
			"getNewAvailableChannelRoom",
			this.sanitize.ChatRoom(available_room),
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
		const user = await this.chatRoomService.getAllUserFromRoom(room_id);
		user.forEach((item) => {
			if (item === user_id) return;
		});
		if (room.type === RoomType.PROTECTED) {
			const isMatch = await bcrypt.compare(password, room.password);
			if (!isMatch) return new UnauthorizedException("Wrong Password");
		}
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

	async changeRoomDetails(
		server: Server,
		socket: Socket,
		room_id: number,
		detail: any,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		let room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		const details: any = {};
		let changed = false;

		if (!this.canChangeDetails(room, user_id)) return;
		if (detail.name && detail.name !== "") details["name"] = detail.name;
		if (detail.remove_pass === true) details["password"] = "";
		else if (detail.password && detail.password !== "")
			details["password"] = await this.chatRoomService.hashPass(
				detail.password,
			);
		if (details.name !== room.name) changed = true;
		if (detail.remove_pass && room.type === RoomType.PROTECTED) {
			changed = true;
			await this.chatRoomService.updateType(room.id, RoomType.PUBLIC);
		} else if (details.password && room.type === RoomType.PUBLIC) {
			changed = true;
			await this.chatRoomService.updateType(room.id, RoomType.PROTECTED);
		}
		if (changed) {
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

	async addUserToRoom(server: Server, socket: Socket, room_id: number, user_ids: number[])
	{
		var room = await this.chatRoomService.getJoinedChannelRoom(room_id);

		if (!this.canAddUser(room, this.wsSocket.getUserId(socket.id)))
			return ;
		for (var i = 0; i < user_ids.length; i++)
			await this.chatRoomService.joinChannelRoom(room_id, user_ids[i]);

		room = await this.chatRoomService.getJoinedChannelRoom(room_id);
		var user_list = await this.chatRoomService.getAllUserFromRoom(room_id);
		this.wsSocket.sendToUsers(
			server,
			user_ids,
			"getNewJoinedChannelRoom",
			this.sanitize.ChatRoom(room),
		);
		for (var i = 0; i < user_list.length; i++)
			for (var j = 0; j < user_ids.length; j++)
				if (user_list[i] === user_ids[j])
					user_list.splice(i, 1);
		for (var i = 0; i < user_ids.length; i++)
		{
			const user = this.sanitize.User(await this.userService.getInfoById(user_ids[i]));
			this.wsSocket.sendToUsers(
				server,
				user_list,
				"getNewUserJoinChannelRoom",
				{
					userId: user_ids[i],
					roomId: room.id,
					isOwner: false,
					isAdmin: false,
					user: user,
				},
			);
		}
	}

	async leaveRoom(server: Server, socket: Socket, room_id: number, target_id: number)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		const room = await this.chatRoomService.getJoinedChannelRoom(room_id);

		if (user_id !== target_id)
			return ;

		await this.chatRoomService.kickUser(room_id, target_id);
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.KICK,
			target_id: target_id,
			room_id: room.id,
		});
	}

	canAddUser(room: ChatRoomEntity, user_id: number): boolean {
		return this.isOwner(room, user_id) || this.isAdmin(room, user_id);
	}

	canChangeDetails(room: ChatRoomEntity, user_id: number): boolean {
		return this.isOwner(room, user_id);
	}

	canKick(room: ChatRoomEntity, user_id: number): boolean {
		return this.isOwner(room, user_id) || this.isAdmin(room, user_id);
	}

	canPromote(room: ChatRoomEntity, user_id: number): boolean {
		return this.isAdmin(room, user_id);
	}

	canGiveKrown(room: ChatRoomEntity, user_id: number): boolean {
		return this.isOwner(room, user_id);
	}

	canTakeAction(
		room: ChatRoomEntity,
		user_id: number,
		action: RoomAction,
	): boolean {
		let result = false;

		switch (action) {
			case RoomAction.KICK: {
				result = this.canKick(room, user_id);
				break;
			}
			case RoomAction.PROMOTE: {
				result = this.canPromote(room, user_id);
				break;
			}
			case RoomAction.OWNERSHIP: {
				result = this.canGiveKrown(room, user_id);
				break;
			}
		}
		return result;
	}

	async kickUser(room: ChatRoomEntity, target_id: number) {
		this.chatRoomService.kickUser(room.id, target_id);
	}

	async promoteUser(room: ChatRoomEntity, target_id: number) {
		this.chatRoomService.promoteUser(room.id, target_id);
	}

	async giveKrown(user_id: number, room: ChatRoomEntity, target_id: number) {
		if (user_id !== target_id)
			this.chatRoomService.giveKrownUser(user_id, room.id, target_id);
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
			case RoomAction.PROMOTE: {
				this.promoteUser(room, target_id);
				break;
			}
			case RoomAction.OWNERSHIP: {
				this.giveKrown(user_id, room, target_id);
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
			case RoomAction.OWNERSHIP: {
				this.emitGiveKrown(server, user_id, room, target_id);
				break;
			}
		}
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

		if (!this.canTakeAction(room, user_id, action)) return;
		this.takeAction(user_id, room, target_id, action);
		this.actionEmit(server, user_id, room, action, target_id);
	}

	isOwner(room: ChatRoomEntity, user_id: number): boolean {
		for (let i = 0; i < room.roomInfo.length; i++) {
			if (room.roomInfo[i].userId === user_id && room.roomInfo[i].isOwner)
				return true;
		}
		return false;
	}

	isAdmin(room: ChatRoomEntity, user_id: number): boolean {
		for (let i = 0; i < room.roomInfo.length; i++) {
			if (room.roomInfo[i].userId === user_id && room.roomInfo[i].isAdmin)
				return true;
		}
		return false;
	}
}
