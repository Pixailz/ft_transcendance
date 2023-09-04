import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { Status } from "src/modules/database/user/entity";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSSocket } from "../socket.service";
import { ChatRoomEntity, RoomType } from "src/modules/database/chatRoom/entity";
import * as bcrypt from "bcrypt";

export enum RoomAction {
	KICK,
}

@Injectable()
export class WSChatService {
	constructor(
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		public wsSocket: WSSocket,
	) {}

	// BASE
	async connection(server: Server, socket: Socket) {
		const user_id = this.userService.decodeToken(
			socket.handshake.headers.authorization,
		);
		if (!user_id) {
			socket.emit(
				"Error",
				new UnauthorizedException("Invalid JWT Token"),
			);
			this.disconnect(server, socket);
		}
		const user_info = await this.userService.getInfoById(user_id);
		if (!user_info) {
			this.disconnect(server, socket);
			return new UnauthorizedException(
				`[WS:connection] user, ${user_id}, not found`,
			);
		}
		this.wsSocket.addNewSocketId(user_info.id, socket.id);
		console.log(
			`[WS:connection] User ${user_info.ftLogin} connected (${socket.id})`,
		);
		await this.setStatus(server, user_id, Status.CONNECTED);
	}

	async disconnect(server: Server, socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		console.log(`[WS] Disconnected ${socket.id}`);
		await this.setStatus(server, user_id, Status.DISCONNECTED).catch(
			(err) => console.log(err),
		);
		this.wsSocket.removeSocket(socket.id);
	}

	// FRIENDS
	async getAllFriend(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllFriend",
			await this.userService.getAllFriend(user_id),
		);
	}

	// PRIVATE ROOM
	async getAllPrivateRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const all_user_chat_room = await this.chatRoomService.getAllPrivateRoom(
			user_id,
		);
		const rooms = [];
		let j = 0;

		for (let i = 0; i < all_user_chat_room.length; i++) {
			const chat_room =
				await this.chatRoomService.getPrivateRoomFromRoomId(
					all_user_chat_room[i].id,
				);
			for (j = 0; j < chat_room.roomInfo.length; j++)
				if (chat_room.roomInfo[j].user.id !== user_id) break;
			if (j === chat_room.roomInfo.length) {
				chat_room.roomInfo.splice(1, 1);
				rooms.push(chat_room);
				continue;
			}

			for (j = 0; j < chat_room.roomInfo.length; j++)
				if (chat_room.roomInfo[j].user.id === user_id)
					chat_room.roomInfo.splice(j, 1);
			rooms.push(chat_room);
		}
		socket.emit("getAllPrivateRoom", rooms);
	}

	async createPrivateRoom(server: Server, socket: Socket, dst_id: number) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room_id = await this.chatRoomService.createPrivateRoom(
			user_id,
			dst_id,
		);
		let chat_room = await this.chatRoomService.getPrivateRoomFromRoomId(
			room_id,
		);

		for (let i = 0; i < chat_room.roomInfo.length; i++)
			if (chat_room.roomInfo[i].user.id === user_id && user_id !== dst_id)
				chat_room.roomInfo.splice(i, 1);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewPrivateRoom",
			chat_room,
		);
		if (user_id === dst_id) return;
		chat_room = await this.chatRoomService.getPrivateRoomFromRoomId(
			room_id,
		);
		for (let i = 0; i < chat_room.roomInfo.length; i++)
			if (chat_room.roomInfo[i].user.id === dst_id)
				chat_room.roomInfo.splice(i, 1);
		this.wsSocket.sendToUser(
			server,
			dst_id,
			"getNewPrivateRoom",
			chat_room,
		);
	}

	async getAllPrivateMessage(socket: Socket): Promise<any> {
		const user_id = this.wsSocket.getUserId(socket.id);
		const chat_room = await this.chatRoomService.getAllPrivateRoom(user_id);
		const messages: any = {};

		for (let i = 0; i < chat_room.length; i++)
			messages[chat_room[i].id] =
				await this.chatRoomService.getAllPrivateMessageRoom(
					chat_room[i].id,
				);
		socket.emit("getAllPrivateMessage", messages);
	}

	async sendPrivateMessage(
		server: Server,
		socket: Socket,
		dst_id: number,
		message: string,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);

		await this.chatRoomService.sendMessage(dst_id, user_id, message);
		const all_user = await this.chatRoomService.getAllUserFromRoom(dst_id);
		const all_message = await this.chatRoomService.getAllPrivateMessageRoom(
			dst_id,
		);

		for (let i = 0; i < all_user.length; i++) {
			this.wsSocket.sendToUser(
				server,
				all_user[i],
				"getNewPrivateMessage",
				{
					room_id: dst_id,
					messages: all_message,
				},
			);
		}
	}

	// GLOBAL ROOM
	async getAllAvailableGlobalRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		var all_global_room =
			await this.chatRoomService.getAllAvailableGlobalRoom();

		for (var i = 0; i < all_global_room.length; i++)
		{
			var room = all_global_room[i];
			for (var j = 0; j < room.roomInfo.length; j++)
			{
				var room_info = room.roomInfo[j];
				if (room_info.userId === user_id)
				{
					delete all_global_room[i];
				}
			}
		}
		if (all_global_room.length === 0 ||
			all_global_room[0] === null)
			return ;
		all_global_room.forEach((room) => {
			delete room["password"];
		});
		socket.emit("getAllAvailableGlobalRoom", all_global_room);
	}

	async getAllJoinedGlobalRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const all_joined_room =
			await this.chatRoomService.getAllJoinedGlobalRoom(user_id);
		let all_joined: ChatRoomEntity[] = [];

		for (let i = 0; i < all_joined_room.length; i++)
		{
			all_joined.push(
				await this.chatRoomService.getJoinedGlobalRoom(all_joined_room[i].id)
			);
		}
		all_joined.forEach((ii, i) => {
			all_joined[i].roomInfo.forEach((jj, j) => {
				delete all_joined[i].roomInfo[j].user.nonce;
				delete all_joined[i].roomInfo[j].user.twoAuthFactor;
				delete all_joined[i].roomInfo[j].user.twoAuthFactorSecret;
			})
		})

		all_joined.forEach((ii, i) => {
			all_joined[i].roomInfo.forEach((jj, j) => {
				console.log(all_joined[i].roomInfo[j].user);
			})
		})
		socket.emit("getAllJoinedGlobalRoom", all_joined);
	}

	async createGlobalRoom(
		server: Server,
		socket: Socket,
		name: string,
		password: string,
		user_ids: number[],
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room_id = await this.chatRoomService.createGlobalRoomAddUser(
			user_id,
			name,
			password,
			user_ids,
		);
		const available_room =
			await this.chatRoomService.getAvailableGlobalRoom(room_id);
		const joined_room = await this.chatRoomService.getJoinedGlobalRoom(
			room_id,
		);

		for (var i in this.wsSocket.socket_list)
		{
			if (Number(i) === user_id)
				continue;
			this.wsSocket.sendToUser(
				server,
				Number(i),
				"getNewAvailableGlobalRoom",
				available_room,
			);
		}
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewJoinedGlobalRoom",
			joined_room,
		);
		for (let i = 0; i < user_ids.length; i++)
			this.wsSocket.sendToUser(
				server,
				user_ids[i],
				"getNewJoinedGlobalRoom",
				joined_room,
			);
	}

	async joinGlobalRoom(
		server: Server,
		socket: Socket,
		room_id: number,
		password: string,
	) {
		const room = await this.chatRoomService.getJoinedGlobalRoom(room_id);
		const user_id = this.wsSocket.getUserId(socket.id);
		const user = await this.chatRoomService.getAllUserFromRoom(room_id);
		user.forEach((item) => {
			if (item === user_id)
				return ;
		})
		if (room.type === RoomType.PROTECTED) {
			const isMatch = await bcrypt.compare(password, room.password);
			if (!isMatch) return new UnauthorizedException("Wrong Password");
		}
		await this.chatRoomService.joinGlobalRoom(room.id, user_id);
		const user_chatroom = await this.chatRoomService.getUserChatRoom(user_id, room.id)
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewJoinedGlobalRoom",
			room,
		);
		user.forEach((user_id) => {
			this.wsSocket.sendToUser(
				server, user_id, "getNewUserJoinGlobalRoom", user_chatroom);
		})
	}

	async setStatus(server: Server, user_id: number, status: number) {
		await this.userService.setStatus(user_id, status);
		const friends = await this.userService.getAllFriend(user_id);
		for (let i = 0; i < friends.length; i++) {
			this.wsSocket.sendToUser(
				server,
				friends[i].id,
				"getNewStatusFriend",
				{
					user_id: user_id,
					status: status,
				},
			);
		}
	}

	async sendGlobalMessage(
		server: Server,
		socket: Socket,
		dst_id: number,
		message: string,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);

		await this.chatRoomService.sendMessage(dst_id, user_id, message);
		const all_user = await this.chatRoomService.getAllUserFromRoom(dst_id);
		const all_message = await this.chatRoomService.getAllGlobalMessageRoom(
			dst_id,
		);
		for (let i = 0; i < all_user.length; i++) {
			this.wsSocket.sendToUser(
				server,
				all_user[i],
				"getNewGlobalMessage",
				{
					room_id: dst_id,
					messages: all_message,
				},
			);
		}
	}

	async changeRoomDetails(
		server: Server,
		socket: Socket,
		room_id: number,
		detail: any,
	)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		var room = await this.chatRoomService.getJoinedGlobalRoom(room_id);
		var details: any = {};
		var changed: boolean = false;

		if (!this.isOwner(room, user_id))
			return ;
		if (detail.name && detail.name !== "")
			details["name"] = detail.name;
		if (detail.remove_pass === true)
			details["password"] = "";
		else if (detail.password && detail.password !== "")
			details["password"] = await this.chatRoomService.hashPass(detail.password);
		if (details.name !== room.name)
			changed = true;
		if (detail.remove_pass && room.type === RoomType.PROTECTED)
		{
			changed = true;
			await this.chatRoomService.updateType(room.id, RoomType.PUBLIC);
		}
		else if (details.password && room.type === RoomType.PUBLIC)
		{
			changed = true;
			await this.chatRoomService.updateType(room.id, RoomType.PROTECTED);
		}
		if (changed)
		{
			await this.chatRoomService.changeRoomDetails(room_id, details);
			room = await this.chatRoomService.getJoinedGlobalRoom(room_id);
			this.wsSocket.sendToUserInRoom(
								server, room, "getNewDetailsGlobalRoom", room);
		}
	}

	canKick(room: ChatRoomEntity, user_id: number): boolean
	{
		return (this.isAdmin(room, user_id) || this.isAdmin(room, user_id));
	}

	canTakeAction(room: ChatRoomEntity, user_id: number, action: RoomAction): boolean
	{
		var result: boolean = false;

		switch (action) {
			case RoomAction.KICK: { result = this.canKick(room, user_id); break; }
		}
		return (result);
	}

	async kickUser(room: ChatRoomEntity, target_id: number)
	{
		this.chatRoomService.kickUser(room.id, target_id);
	}

	takeAction(room: ChatRoomEntity, target_id: number, action: RoomAction)
	{
		switch (action) {
			case RoomAction.KICK: { this.kickUser(room, target_id); break; }
		}
	}

	emitKick(
		server: Server,
		room: ChatRoomEntity,
		target_id: number,
	)
	{
		this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
			action: RoomAction.KICK,
			target_id: target_id,
			room_id: room.id,
		})
	}

	actionEmit(
		server: Server,
		room: ChatRoomEntity,
		action: RoomAction,
		target_id: number,
	)
	{
		switch (action) {
			case RoomAction.KICK: { this.emitKick(server, room, target_id); break; }
		}
	}


	async takeRoomAction(
		server: Server,
		socket: Socket,
		room_id: number,
		action: RoomAction,
		target_id: number,
	)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		const room = await this.chatRoomService.getJoinedGlobalRoom(room_id);

		if (!this.canTakeAction(room, user_id, action))
			return ;
		this.takeAction(room, target_id, action);
		this.actionEmit(server, room, action, target_id);
		// this.wsSocket.sendToUserInRoom(server, room, "roomAction", {
		// 	action: action,
		// 	target_id: target_id,
		// 	return: room,
		// });
	}

	isOwner(room: ChatRoomEntity, user_id: number): boolean
	{
		for (var i = 0; i < room.roomInfo.length; i++)
		{
			if (room.roomInfo[i].userId === user_id &&
				room.roomInfo[i].isOwner)
				return (true);
		}
		return (false);
	}

	isAdmin(room: ChatRoomEntity, user_id: number): boolean
	{
		for (var i = 0; i < room.roomInfo.length; i++)
		{
			if (room.roomInfo[i].userId === user_id &&
				room.roomInfo[i].isAdmin)
				return (true);
		}
		return (false);
	}
}
