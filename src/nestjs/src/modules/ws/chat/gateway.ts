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
import { UserEntity } from "src/modules/database/user/entity";
import { DBUserService } from "src/modules/database/user/service";
import { DBUserChatRoomService } from "src/modules/database/userChatRoom/service";
import { isNumberObject } from "util/types";

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
	handleMessage(socket: Socket, data: any) {
		console.log("[WS:sendMessage] ", data);
		if (typeof data[0] == "number" && data[0] < 1)
			return ;
		this.server.emit("newMessage", `[${data[0]}]: {${data[1]}} `);
	}

	@SubscribeMessage("getRoomIds")
	getRoomIds(socket: Socket, from: number) {
		socket.emit("sendRoomIds", this.getAllRoomId(from));
	}

	// @SubscribeMessage("sendMessage")
	// handleMessage(socket: Socket, message: string) {
	// 	console.log("[WS:sendMessage] ", message);
	// 	this.server.emit("newMessage", message);
	// }
}
