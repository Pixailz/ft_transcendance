import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WSChatService } from "./chat/chat.service";

@WebSocketGateway(3001, {
	path: "/ws",
	cors: { origin: "*" },
})
export class WSGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private wsChatService: WSChatService) {}

	@WebSocketServer()
	server = new Server();

	async handleConnection(socket: Socket) {
		await this.wsChatService.connection(this.server, socket);
	}

	async handleDisconnect(socket: Socket) {
		await this.wsChatService.disconnect(this.server, socket);
	}

	@SubscribeMessage("getAllFriend")
	async getAllFriend(socket: Socket) {
		await this.wsChatService.getAllFriend(socket);
	}

	@SubscribeMessage("getAllPrivateRoom")
	async getAllPrivateRoom(socket: Socket) {
		await this.wsChatService.getAllPrivateRoom(socket);
	}

	@SubscribeMessage("getAllPrivateMessage")
	async getAllPrivateMessage(socket: Socket) {
		await this.wsChatService.getAllPrivateMessage(socket);
	}

	@SubscribeMessage("createPrivateRoom")
	async handleCreatePrivateRoom(socket: Socket, dst_id: number) {
		await this.wsChatService.createPrivateRoom(this.server, socket, dst_id);
	}

	@SubscribeMessage("sendPrivateMessage")
	async handleSendPrivateMessage(socket: Socket, data: any) {
		await this.wsChatService.sendPrivateMessage(
			this.server,
			socket,
			data[0],
			data[1],
		);
	}
}
