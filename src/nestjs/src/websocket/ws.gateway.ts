import {
	OnGatewayConnection,
	OnGatewayDisconnect,
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
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

	// GLOBAL CHAT
	@SubscribeMessage("getAllAvailableGlobalRoom")
	async handleGetAllAvailableGlobalRoom(socket: Socket) {
		this.wsChatService.getAllAvailableGlobalRoom(socket);
	}

	@SubscribeMessage("getAllJoinedGlobalRoom")
	async handleGetAllJoinedGlobalRoom(socket: Socket) {
		this.wsChatService.getAllJoinedGlobalRoom(socket);
	}

	@SubscribeMessage("createGlobalRoom")
	async handleCreateGlobalRoom(socket: Socket, data: any) {
		const name = data[0];
		const password = data[1] ? data[1] : "";
		const user_id = data[2];
		this.wsChatService.createGlobalRoom(
			this.server,
			socket,
			name,
			password,
			user_id,
		);
	}

	@SubscribeMessage("joinGlobalRoom")
	async handleJoinGlobalRoom(socket: Socket, data: any) {
		const room_id = data[0];
		const password = data[1] ? data[1] : "";
		await this.wsChatService.joinGlobalRoom(
			this.server,
			socket,
			room_id,
			password,
		);
	}

	@SubscribeMessage("sendGlobalMessage")
	async handleSendGlobalMessage(socket: Socket, data: any) {
		await this.wsChatService.sendGlobalMessage(
			this.server,
			socket,
			data[0],
			data[1],
		);
	}

	@SubscribeMessage("changeRoomDetails")
	async handleChangeRoomDetail(socket: Socket, data: any) {
		const room_id = data[0];
		const details = data[1];
		await this.wsChatService.changeRoomDetails(
			this.server,
			socket,
			room_id,
			details,
		);
	}

	@SubscribeMessage("roomAction")
	async handleRoomAction(socket: Socket, data: any) {
		const room_id = data[0];
		const action = data[1];
		const target_id = data[2];

		await this.wsChatService.takeRoomAction(
			this.server,
			socket,
			room_id,
			action,
			target_id,
		);
	}
}
