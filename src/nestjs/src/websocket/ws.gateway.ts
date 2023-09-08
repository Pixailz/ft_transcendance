import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WSService } from "./ws.service";
import { WSChatDmService } from "./chat/chat-dm.service";
import { WSChatChannelService } from "./chat/chat-channel.service";
import { WSFriendService } from "./friend/friend.service";

@WebSocketGateway(3001, {
	path: "/ws",
	cors: { origin: "*" },
})
export class WSGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private wsService: WSService,
		private wsChatDmService: WSChatDmService,
		private wsChatChannelService: WSChatChannelService,
		private wsFriendService: WSFriendService,
	) {}

	@WebSocketServer()
	server = new Server();

	// BASE
	async handleConnection(socket: Socket)
	{ await this.wsService.connection(this.server, socket); }

	async handleDisconnect(socket: Socket)
	{ await this.wsService.disconnect(this.server, socket); }

	// DIRECT MESSAGE CHAT

	// HANDLER
	@SubscribeMessage("getAllDmRoom")
	async getAllDmRoom(socket: Socket)
	{ await this.wsChatDmService.getAllDmRoom(socket); }

	@SubscribeMessage("getAllDmMessage")
	async getAllDmMessage(socket: Socket)
	{ await this.wsChatDmService.getAllDmMessage(socket); }

	@SubscribeMessage("createDmRoom")
	async handleCreateDmRoom(socket: Socket, dst_id: number)
	{ await this.wsChatDmService.createDmRoom(this.server, socket, dst_id); }

	@SubscribeMessage("sendDmMessage")
	async handleSendDmMessage(socket: Socket, data: any)
	{ await this.wsChatDmService.sendDmMessage(
			this.server,
			socket,
			data[0],
			data[1],
		); }

	// GLOBAL CHAT

	// HANDLER
	@SubscribeMessage("getAllAvailableChannelRoom")
	async handleGetAllAvailableChannelRoom(socket: Socket)
	{ this.wsChatChannelService.getAllAvailableChannelRoom(socket); }

	@SubscribeMessage("getAllJoinedChannelRoom")
	async handleGetAllJoinedChannelRoom(socket: Socket)
	{ this.wsChatChannelService.getAllJoinedChannelRoom(socket); }

	@SubscribeMessage("createChannelRoom")
	async handleCreateChannelRoom(socket: Socket, data: any)
	{
		const name = data[0];
		const password = data[1] ? data[1] : "";
		const user_id = data[2];
		this.wsChatChannelService.createChannelRoom(
			this.server,
			socket,
			name,
			password,
			user_id,
		);
	}

	@SubscribeMessage("joinChannelRoom")
	async handleJoinChannelRoom(socket: Socket, data: any)
	{
		const room_id = data[0];
		const password = data[1] ? data[1] : "";
		await this.wsChatChannelService.joinChannelRoom(
			this.server,
			socket,
			room_id,
			password,
		);
	}

	@SubscribeMessage("sendGlobalMessage")
	async handleSendGlobalMessage(socket: Socket, data: any)
	{
		await this.wsChatChannelService.sendGlobalMessage(
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
		await this.wsChatChannelService.changeRoomDetails(
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

		await this.wsChatChannelService.takeRoomAction(
			this.server,
			socket,
			room_id,
			action,
			target_id,
		);
	}


	// FRIENDS

	// HANDLER
	@SubscribeMessage("getAllFriend")
	async getAllFriend(socket: Socket)
	{ await this.wsFriendService.getAllFriend(socket); }

	@SubscribeMessage("getAllFriendRequest")
	async getAllFriendRequest(socket: Socket)
	{ await this.wsFriendService.getAllFriendRequest(socket); }

	@SubscribeMessage("sendFriendReq")
	async sendFriendReq(socket: Socket, id: number)
	{ await this.wsFriendService.sendFriendReq(this.server, socket, id); }


	// NOTIFICATION

	// HANDLER
	// @SubscribeMessage("getAllReqById")
	// async getAllReqById(socket: Socket)
	// { await this.wsFriendRequestService.getAllReqById(socket); }

	// @SubscribeMessage("acceptFriendReq")
	// async acceptFriendReq(socket: Socket, id: number)
	// { await this.wsFriendRequestService.acceptFriendReq(this.server, socket, id); }

	// @SubscribeMessage("rejectFriendReq")
	// async rejectFriendReq(socket: Socket, id: number)
	// { await this.wsFriendRequestService.rejectFriendReq(this.server, socket, id); }

	// @SubscribeMessage("friendReqStatus")
	// async friendReqStatus(socket: Socket, id: number)
	// { await this.wsFriendRequestService.friendReqStatus(socket, id); }

	// @SubscribeMessage("sendNotification")
	// async sendNotification(server: Server, socket: Socket, prefix: string, friend_id: number) {
	// 	await this.wsFriendRequestService.sendNotification(server, socket, friend_id, prefix);
	// }
}
