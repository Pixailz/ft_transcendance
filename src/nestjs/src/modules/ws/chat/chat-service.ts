import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { WSService } from "../ws.service";
import { Status } from "src/modules/database/user/entity";
import { ChatRoomService } from "src/adapter/chatRoom/service";

@Injectable()
export class WSChatService
{
	constructor (
		private userService: UserService,
		private wsService: WSService,
		private chatRoomService: ChatRoomService,
	) { }

	async connection(server, socket: Socket)
	{
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
				`[WS] user, ${user_id}, not found`,
			);
		}
		this.wsService.socket_list.push({
			socket_id: socket.id,
			user: user_info,
		});
		console.log(
			`[WS:handleConnection] User ${user_info.ftLogin} connected (${socket.id})`,
		);
		this.wsService.setStatus(server, user_id, Status.CONNECTED);
	}

	disconnect (server, socket: Socket)
	{
		const user_info = this.wsService.getUser(socket.id);
		console.log(`[WS:handleDisconnect] Disconnected ${user_info.ftLogin}`);
		this.wsService.removeSocket(socket.id);
		this.wsService.setStatus(server, user_info.id, Status.DISCONNECTED);
		socket.disconnect();
	}

	async sendNewRoom(socket: Socket)
	{
		const user = this.wsService.getUser(socket.id);
		socket.emit(
			"getNewRoom",
			await this.chatRoomService.getAllRoom(user.id),
		);
	}

	async sendNewFriend(socket: Socket)
	{
		const user = this.wsService.getUser(socket.id);
		socket.emit(
			"getNewFriend",
			await this.userService.getAllFriend(user.id),
		);
	}

	async sendNewStatusFriend(socket: Socket)
	{
		const user = this.wsService.getUser(socket.id);
		socket.emit(
			"getNewStatusFriend",
			await this.userService.getAllStatusFriend(user.id),
		);
	}

	async createNewRoom(server, socket: Socket, dst_id: number)
	{
		const user = this.wsService.getUser(socket.id);
		const dst_socket_id = this.wsService.getSocketId(dst_id);

		await this.chatRoomService.createPrivateRoom(user.id, dst_id);
		socket.emit(
			"getNewRoom",
			await this.chatRoomService.getAllRoom(user.id),
		);
		server
			.to(dst_socket_id)
			.emit("getNewRoom", await this.chatRoomService.getAllRoom(dst_id));
	}

	async sendMessage(server, socket: Socket, dst_id: number, message: string)
	{
		const user = this.wsService.getUser(socket.id);

		await this.chatRoomService.sendMessage(dst_id, user.id, message);
		const all_user = await this.chatRoomService.getAllUserFromRoom(dst_id);
		const all_message = await this.chatRoomService.getAllMessageRoom(dst_id);

		for (var i = 0; i < all_user.length; i++) {
			let socket_id = this.wsService.getSocketId(all_user[i]);
			server.to(socket_id).emit("getNewMessage", all_message);
		}
	}

	async newMessage(socket: Socket, room_id: number)
	{
		const user = this.wsService.getUser(socket.id);
		let all_message = await this.chatRoomService.getAllMessageRoom(room_id);
		socket.emit("getNewMessage", all_message);
	}
}
