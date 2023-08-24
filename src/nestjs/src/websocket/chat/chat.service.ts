import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { Status } from "src/modules/database/user/entity";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSSocket } from "../socket.service";

@Injectable()
export class WSChatService {
	constructor(
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		public wsSocket: WSSocket,
	) {}

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
		console.log(`[WS:connection] User ${user_info.ftLogin} connected (${socket.id})`);
		await this.setStatus(server, user_id, Status.CONNECTED);
	}

	async disconnect(server: Server, socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		console.log(`[WS:disconnect] Disconnected ${socket.id}`);
		await this.setStatus(server, user_id, Status.DISCONNECTED);
		this.wsSocket.removeSocket(socket.id);
		socket.disconnect();
	}

	async getAllFriend(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllFriend",
			await this.userService.getAllFriend(user_id),
		);
	}

	async getAllPrivateRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const all_user_chat_room = await this.chatRoomService.getAllPrivateRoom(
			user_id,
		);
		var rooms = [];
		var j: number = 0;

		for (var i = 0; i < all_user_chat_room.length; i++) {
			const chat_room =
				await this.chatRoomService.getPrivateRoomFromRoomId(
					all_user_chat_room[i].id,
				);
			for (var j = 0; j < chat_room.roomInfo.length; j++)
				if (chat_room.roomInfo[j].user.id !== user_id) break;
			if (j === chat_room.roomInfo.length) {
				chat_room.roomInfo.splice(1, 1);
				rooms.push(chat_room);
				continue;
			}

			for (var j = 0; j < chat_room.roomInfo.length; j++)
				if (chat_room.roomInfo[j].user.id === user_id)
					chat_room.roomInfo.splice(j, 1);
			rooms.push(chat_room);
		}
		socket.emit("getAllPrivateRoom", rooms);
	}

	async createPrivateRoom(server: Server, socket: Socket, dst_id: number) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const src_socket_id = this.wsSocket.getSocketId(user_id);
		const dst_socket_id = this.wsSocket.getSocketId(dst_id);

		const room_id = await this.chatRoomService.createPrivateRoom(
			user_id,
			dst_id,
		);

		let chat_room = await this.chatRoomService.getPrivateRoomFromRoomId(
			room_id,
		);
		for (var i = 0; i < chat_room.roomInfo.length; i++)
			if (chat_room.roomInfo[i].user.id === user_id && user_id !== dst_id)
				chat_room.roomInfo.splice(i, 1);
		for (var i = 0; i < src_socket_id.length; i++)
			server.to(src_socket_id[i]).emit("getNewPrivateRoom", chat_room);
		if (user_id === dst_id) return;
		chat_room = await this.chatRoomService.getPrivateRoomFromRoomId(
			room_id,
		);
		for (var i = 0; i < chat_room.roomInfo.length; i++)
			if (chat_room.roomInfo[i].user.id === dst_id)
				chat_room.roomInfo.splice(i, 1);
		if (!dst_socket_id)
			return ;
		for (var i = 0; i < dst_socket_id.length; i++)
			server.to(dst_socket_id[i]).emit("getNewPrivateRoom", chat_room);
	}

	async getAllPrivateMessage(socket: Socket): Promise<any> {
		const user_id = this.wsSocket.getUserId(socket.id);
		const chat_room = await this.chatRoomService.getAllPrivateRoom(user_id);
		var messages: any = {};

		for (var i = 0; i < chat_room.length; i++)
			messages[chat_room[i].id] =
				await this.chatRoomService.getAllMessageRoom(chat_room[i].id);
		socket.emit("getAllPrivateMessage", messages);
	}

	async setStatus(server: Server, user_id: number, status: number) {
		await this.userService.setStatus(user_id, status);
		const friends = await this.userService.getAllFriend(user_id);
		for (let i = 0; i < friends.length; i++) {
			let friends_socket_id = this.wsSocket.getSocketId(friends[i].id);
			if (!friends_socket_id) continue;
			for (let j = 0; j < friends_socket_id.length; j++)
				server.to(friends_socket_id[j]).emit("getNewStatusFriend", {
					user_id: user_id,
					status: status,
				});
		}
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
		const all_message = await this.chatRoomService.getAllMessageRoom(
			dst_id,
		);

		for (var i = 0; i < all_user.length; i++) {
			let socket_ids = this.wsSocket.getSocketId(all_user[i]);
			for (let i = 0; i < socket_ids.length; i++) {
				server.to(socket_ids[i]).emit("getNewPrivateMessage", {
					room_id: dst_id,
					messages: all_message,
				});
			}
		}
	}
}
