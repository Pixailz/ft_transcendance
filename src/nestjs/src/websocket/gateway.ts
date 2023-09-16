import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WSService } from "./service";
import { WSChatDmService } from "./chat/chat-dm.service";
import { WSChatChannelService } from "./chat/chat-channel.service";
import { WSFriendService } from "./friend/friend.service";
import { WSNotificationService } from "./notifications/notifications.service";
import { NotifStatus } from "src/modules/database/notification/entity";

@WebSocketGateway(3001, {
	path: "/ws",
	cors: { origin: "*" },
})
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private wsService: WSService,
		private wsChatDmService: WSChatDmService,
		private wsChatChannelService: WSChatChannelService,
		private wsFriendService: WSFriendService,
		private wsNotificationService: WSNotificationService,
	) {}

	@WebSocketServer()
	server = new Server();

	// BASE
	async handleConnection(socket: Socket) {
		await this.wsService.connection(this.server, socket);
	}

	async handleDisconnect(socket: Socket) {
		await this.wsService.disconnect(this.server, socket);
	}

	// DIRECT MESSAGE CHAT

	// HANDLER
	@SubscribeMessage("getAllDmRoom")
	async getAllDmRoom(socket: Socket) {
		await this.wsChatDmService.getAllDmRoom(socket);
	}

	@SubscribeMessage("createDmRoom")
	async handleCreateDmRoom(socket: Socket, dst_id: number) {
		await this.wsChatDmService.createDmRoom(this.server, socket, dst_id);
	}

	@SubscribeMessage("sendDmMessage")
	async handleSendDmMessage(socket: Socket, data: any) {
		await this.wsChatDmService.sendDmMessage(
			this.server,
			socket,
			data[0],
			data[1],
		);
	}

	// CHANNEL CHAT

	// HANDLER
	@SubscribeMessage("getAllAvailableChannelRoom")
	async handleGetAllAvailableChannelRoom(socket: Socket) {
		this.wsChatChannelService.getAllAvailableChannelRoom(socket);
	}

	@SubscribeMessage("getAllJoinedChannelRoom")
	async handleGetAllJoinedChannelRoom(socket: Socket) {
		this.wsChatChannelService.getAllJoinedChannelRoom(socket);
	}

	@SubscribeMessage("createChannelRoom")
	async handleCreateChannelRoom(socket: Socket, data: any) {
		const name: string = data[0];
		const password: string = data[1] ? data[1] : "";
		const is_private: boolean = data[2];
		const user_id: number[] = data[3];
		this.wsChatChannelService.createChannelRoom(
			this.server,
			socket,
			name,
			password,
			is_private,
			user_id,
		);
	}

	@SubscribeMessage("joinChannelRoom")
	async handleJoinChannelRoom(socket: Socket, data: any) {
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
	async handleSendGlobalMessage(socket: Socket, data: any) {
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

	@SubscribeMessage("addUserToRoom")
	async handleAddUserToChannel(socket: Socket, data: any) {
		const room_id: number = data[0];
		const user_ids: number[] = data[1];
		await this.wsChatChannelService.addUserToRoom(
			this.server,
			socket,
			room_id,
			user_ids,
		);
	}

	@SubscribeMessage("leaveRoom")
	async handleLeaveRoom(socket: Socket, data: any) {
		const room_id: number = data[0];
		const user_id: number = data[1];
		await this.wsChatChannelService.leaveRoom(
			this.server,
			socket,
			room_id,
			user_id,
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

	@SubscribeMessage("channelMute")
	async handleChannelMute(socket: Socket, data: any) {
		const room_id = data[0];
		const target_id = data[1];
		const muted_time = data[2];

		await this.wsChatChannelService.muteUser(
			this.server,
			socket,
			room_id,
			target_id,
			muted_time,
		);
	}

	// FRIENDS

	// HANDLER
	@SubscribeMessage("getAllFriend")
	async getAllFriend(socket: Socket) {
		await this.wsFriendService.getAllFriend(socket);
	}

	@SubscribeMessage("getAllFriendRequest")
	async getAllFriendRequest(socket: Socket) {
		await this.wsFriendService.getAllFriendRequest(socket);
	}

	@SubscribeMessage("getAllBlocked")
	async getAllBlocked(socket: Socket) {
		await this.wsFriendService.getAllBlocked(socket);
	}

	@SubscribeMessage("sendFriendRequest")
	async sendFriendRequest(socket: Socket, id: number) {
		await this.wsFriendService.sendFriendRequest(this.server, socket, id);
	}

	@SubscribeMessage("acceptFriendRequest")
	async acceptFriendRequest(socket: Socket, friend_id: number) {
		await this.wsFriendService.acceptFriendRequest(
			this.server,
			socket,
			friend_id,
		);
	}

	@SubscribeMessage("rejectFriendRequest")
	async rejectFriendRequest(socket: Socket, friend_id: number) {
		await this.wsFriendService.rejectFriendRequest(
			this.server,
			socket,
			friend_id,
		);
	}

	@SubscribeMessage("blockUser")
	async blockUser(socket: Socket, target_id: number) {
		await this.wsFriendService.blockUser(
			this.server,
			socket,
			target_id,
		);
	}

	@SubscribeMessage("unblockUser")
	async unblockUser(socket: Socket, target_id: number) {
		await this.wsFriendService.unblockUser(
			this.server,
			socket,
			target_id,
		);
	}

	// NOTIFICATIONS

	// HANDLER
	@SubscribeMessage("getAllNotifications")
	async getAllNotifications(socket: Socket) {
		await this.wsNotificationService.getAllNotifications(socket);
	}

	@SubscribeMessage("updateNotificationStatus")
	async updateNotificationStatus(socket: Socket, data: any) {
		const status: NotifStatus = data[0];
		const notif_id: number = data[1];
		await this.wsNotificationService.updateNotificationStatus(socket, notif_id, status);
	}

}
