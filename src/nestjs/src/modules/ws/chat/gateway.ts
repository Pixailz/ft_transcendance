import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/modules/auth/service";
import { DBUserService } from "src/modules/database/user/service";
import { DBUserChatRoomService } from "src/modules/database/userChatRoom/service";

@WebSocketGateway(3001, {
	path: "/ws/chat",
	cors: { origin: '*' },
})
export class WSChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private authService: AuthService,
		private jwtService: JwtService,
		private dbUserService: DBUserService,
		private dbUserChatRoomService: DBUserChatRoomService,
		) {}

	@WebSocketServer()
	server: Server;

	nickname: string;

	room_ids: number[];

	async handleConnection(socket: Socket) {
		if (
			!this.authService.validateToken(
				socket.handshake.headers.authorization,
			)
		) {
			socket.emit(
				"Error",
				new UnauthorizedException("Invalid JWT Token"),
			);
			this.handleDisconnect(socket);
		}
		const user_id = this.jwtService.decode(
				socket.handshake.headers.authorization).sub
		const user_info = await this.dbUserService.returnOne(user_id);
		if (!user_info)
			return new UnauthorizedException("[WS] user not found");
		if (!user_info.nickname)
			this.nickname = "<unknown>";
		else
			this.nickname = user_info.nickname;
		
		this.room_ids = await this.getAllRoomId(user_id);
		console.log(this.room_ids);
		console.log("nickname ", this.nickname);
		console.log("[WS:handleConnection] Connected");
	}

	async getAllRoomId(user_id: number): Promise<number[]>
	{
		let room_ids = [];

		const user_chat_rooms = await this.dbUserChatRoomService.getAllChatFromUser(user_id);
		for(const val of user_chat_rooms) {
			room_ids.push(val.roomId);
		}
		return (room_ids);
	}

	handleDisconnect(socket: Socket) {
		console.log("[WS:handleDisconnect] Disconnected");
		socket.disconnect();
	}

	@SubscribeMessage("sendMessage")
	handleMessage(socket: Socket, message: string) {
		console.log("[WS:sendMessage] ", message);
		this.server.emit("newMessage", message);
	}
}
