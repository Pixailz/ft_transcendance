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

@WebSocketGateway(3001, {
	path: "/ws/chat",
	cors: { origin: '*' },
})
export class WSChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(socket: Socket) {
		const user_id = this.userService.decodeToken(
			socket.handshake.headers.authorization);
		if (!user_id)
		{
			socket.emit(
				"Error",
				new UnauthorizedException("Invalid JWT Token"),
			);
			this.handleDisconnect(socket);
		}
		const user_info = await this.userService.getInfoById(user_id);
		if (!user_info)
		{
			this.handleDisconnect(socket);
			return new UnauthorizedException("[WS] user not found");
		}
		console.log("[WS:handleConnection] User ", user_info.ftLogin, " connected");
		// console.log("[WS:handleConnection] Socket id ", socket.id);
	}

	handleDisconnect(socket: Socket) {
		console.log("[WS:handleDisconnect] Disconnected");
		socket.disconnect();
	}

	@SubscribeMessage("sendMessage")
	handleMessage(socket: Socket, data: any) {
		console.log("[WS:sendMessage] ", data);
		if (typeof data[0] == "number" && data[0] < 1)
			return ;
		this.server.emit("newMessage", `[${data[0]}]: {${data[1]}} `);
	}

	@SubscribeMessage("sendRoomIds")
	async getRoomIds(socket: Socket, user_id: number) {
		socket.emit("newRoomIds", await this.chatRoomService.getAllRoomId(user_id));
	}

	@SubscribeMessage("sendFriendIds")
	async getFriendIds(socket: Socket, user_id: number) {
		socket.emit("newFriendIds", await this.userService.getAllUserId());
	}
}
