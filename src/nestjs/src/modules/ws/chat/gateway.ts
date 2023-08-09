import { UnauthorizedException } from "@nestjs/common";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { UserService } from "src/adapter/user/service";
import { WSService } from "../ws.service";

@WebSocketGateway(3001, {
	path: "/ws/chat",
	cors: { origin: "*" },
})
export class WSChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		private wsService: WSService,
	) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(socket: Socket) {
		const user_id = this.userService.decodeToken(
			socket.handshake.headers.authorization,
		);
		if (!user_id) {
			socket.emit(
				"Error",
				new UnauthorizedException("Invalid JWT Token"),
			);
			this.handleDisconnect(socket);
		}
		const user_info = await this.userService.getInfoById(user_id);
		if (!user_info) {
			this.handleDisconnect(socket);
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
	}

	handleDisconnect(socket: Socket) {
		console.log(
			`[WS:handleDisconnect] Disconnected ${
				this.wsService.getUser(socket.id).ftLogin
			}`,
		);
		this.wsService.removeSocket(socket.id);
		socket.disconnect();
	}

	@SubscribeMessage("sendNewRoom")
	async handleSendNewRoom(socket: Socket) {
		const user = this.wsService.getUser(socket.id);
		socket.emit(
			"getNewRoom",
			await this.chatRoomService.getAllRoom(user.id),
		);
	}

	@SubscribeMessage("sendNewFriend")
	async handleSendNewFriend(socket: Socket) {
		const user = this.wsService.getUser(socket.id);
		socket.emit(
			"getNewFriend",
			await this.userService.getAllFriend(user.id),
		);
	}

	@SubscribeMessage("sendCreateRoom")
	async handleCreateNewRoom(socket: Socket, dst_id: number) {
		const user = this.wsService.getUser(socket.id);
		const dst_socket_id = this.wsService.getSocketId(dst_id);

		await this.chatRoomService.createPrivateRoom(user.id, dst_id);
		socket.emit(
			"getNewRoom",
			await this.chatRoomService.getAllRoom(user.id),
		);
		this.server
			.to(dst_socket_id)
			.emit("getNewRoom", await this.chatRoomService.getAllRoom(dst_id));
	}

	@SubscribeMessage("sendNewMessage")
	async handleSendMessage(socket: Socket, data: any) {
		const user = this.wsService.getUser(socket.id);

		await this.chatRoomService.sendMessage(data[0], user.id, data[1]);
		const all_user = await this.chatRoomService.getAllUserFromRoom(data[0]);
		const all_message = await this.chatRoomService.getAllMessageRoom(
			data[0],
		);

		for (var i = 0; i < all_user.length; i++) {
			let socket_id = this.wsService.getSocketId(all_user[i]);
			this.server.to(socket_id).emit("getNewMessage", all_message);
		}
	}

	@SubscribeMessage("sendUpdateMessage")
	async handleNewMessage(socket: Socket, data: any) {
		const user = this.wsService.getUser(socket.id);
		let all_message = await this.chatRoomService.getAllMessageRoom(data);
		socket.emit("getNewMessage", all_message);
	}
}
