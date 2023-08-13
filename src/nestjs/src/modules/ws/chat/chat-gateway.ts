import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WSChatService } from "./chat-service";

@WebSocketGateway(3001, {
	path: "/ws/chat",
	cors: { origin: "*" },
})
export class WSChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private wsChatService: WSChatService) {}

	@WebSocketServer()
	server = new Server();

	async handleConnection(socket: Socket) {
		this.wsChatService.connection(this.server, socket);
	}

	handleDisconnect(socket: Socket) {
		this.wsChatService.disconnect(this.server, socket);
	}

	@SubscribeMessage("sendNewRoom")
	async handleSendNewRoom(socket: Socket) {
		this.wsChatService.sendNewRoom(socket);
	}

	@SubscribeMessage("sendNewFriend")
	async handleSendNewFriend(socket: Socket) {
		this.wsChatService.sendNewFriend(socket);
	}

	@SubscribeMessage("sendNewStatusFriend")
	async handleSendNewStatusFriend(socket: Socket) {
		this.wsChatService.sendNewStatusFriend(socket);
	}

	@SubscribeMessage("sendCreateRoom")
	async handleCreateNewRoom(socket: Socket, dst_id: number) {
		this.wsChatService.createNewRoom(this.server, socket, dst_id);
	}

	@SubscribeMessage("sendNewMessage")
	async handleSendMessage(socket: Socket, data: any) {
		this.wsChatService.sendMessage(this.server, socket, data[0], data[1]);
	}

	@SubscribeMessage("sendUpdateMessage")
	async handleNewMessage(socket: Socket, data: any) {
		this.wsChatService.newMessage(socket, data);
	}
}
