import { Injectable } from "@nestjs/common";
import { WSSocket } from "../socket.service";
import { DBNotificationService } from "../../modules/database/notification/service";
import { Server, Socket } from "socket.io";
import {
	NotifStatus,
	NotificationEntity,
	NotificationType,
} from "../../modules/database/notification/entity";
import { UserService } from "../../adapter/user/service";
import { WSChatDmService } from "../chat/chat-dm.service";
import { MessageContentEntity, MessageContentType } from "src/modules/database/messageContent/entity";
import { DBChatRoomService } from "src/modules/database/chatRoom/service";

@Injectable()
export class WSNotificationService {
	constructor(
		private userService: UserService,
		private wsChatDmService: WSChatDmService,
		public  wsSocket: WSSocket,
		private dbNotificationService: DBNotificationService,
		private dbChatRoomService: DBChatRoomService,
	) {}

	async getNickname(id: number) {
		const user = await this.userService.getInfoById(id);
		return user.nickname;
	}

	async getAllNotifications(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const notifs: NotificationEntity[] =
			await this.dbNotificationService.getNotifByUserId(user_id);
		socket.emit("getAllNotifications", notifs);
	}

	async sendAchievement(
		server: Server,
		user_id: number,
		achievement_name: string,
		achievement_img: string,
	) {
		const notif = await this.dbNotificationService.create({
			type: NotificationType.ACHIEVEMENT,
			userId: user_id,
			data: achievement_name,
			data2: achievement_img,
		});
		this.wsSocket.sendToUser(server, user_id, "getNewNotification", notif);
	}

	async sendFriendRequest(
		server: Server,
		friend_id: number,
		user_id: number,
	) {
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_SENT,
			userId: user_id,
			data: friend_id.toString(),
			data2: await this.getNickname(friend_id),
		});
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewNotification",
			notif_user,
		);

		const notif_friend = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_RECEIVED,
			userId: friend_id,
			data: user_id.toString(),
		});
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewNotification",
			notif_friend,
		);
	}

	async acceptFriendRequest(
		server: Server,
		friend_id: number,
		user_id: number,
	) {
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_ACCEPTED,
			userId: user_id,
			data: await this.getNickname(friend_id),
		});
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewNotification",
			notif_user,
		);

		const notif_friend = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_ACCEPTED,
			userId: friend_id,
			data: await this.getNickname(user_id),
		});
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewNotification",
			notif_friend,
		);
		await this.delFriendRequest(server, friend_id, user_id);
	}

	async rejectFriendRequest(
		server: Server,
		friend_id: number,
		user_id: number,
	) {
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_DENIED_FROM,
			userId: user_id,
			data: await this.getNickname(friend_id),
		});
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewNotification",
			notif_user,
		);

		const notif_friend = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_DENIED_TO,
			userId: friend_id,
			data: await this.getNickname(user_id),
		});
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewNotification",
			notif_friend,
		);
		await this.delFriendRequest(server, friend_id, user_id);
	}

	async delFriendRequest(server: Server, friend_id: number, user_id: number) {
		const notif_user = await this.dbNotificationService.getNotif(
			friend_id,
			user_id.toString(),
			NotificationType.FRIEND_REQ_SENT,
		);
		const notif_friend = await this.dbNotificationService.getNotif(
			user_id,
			friend_id.toString(),
			NotificationType.FRIEND_REQ_RECEIVED,
		);

		await this.dbNotificationService.delete(notif_user.id);
		await this.dbNotificationService.delete(notif_friend.id);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"delNotification",
			notif_friend.id,
		);
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"delNotification",
			notif_user.id,
		);
	}

	async sendGameInvite(
		server: Server,
		socket: Socket,
		room_id: string,
		friend_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.GAME_REQ,
			userId: friend_id,
			data: room_id,
			data2: await this.getNickname(user_id),
		});
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewNotification",
			notif_user,
		);
		const room = await this.dbChatRoomService.getDmBetween(user_id, friend_id);
		let roomId: number;
		if (!room)
			roomId = await this.wsChatDmService.createDmRoom(server, socket, friend_id);
		else
			roomId = room.id;
		this.wsChatDmService.sendDmMessage(server, socket, roomId, [
			{
				type: MessageContentType.STRING,
				content: "Join me for a game :)",
			} as MessageContentEntity,
			{
				type: MessageContentType.GAME_INVITE,
				content: room_id,
			} as MessageContentEntity,
		])
	}

	async delGameInvite(server:Server, socket: Socket, id: number)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		const notif = await this.dbNotificationService.returnOne(id);
		if (!notif)
		{
			console.log('Notif not found');
			return ;
		}
		await this.dbNotificationService.delete(notif.id);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"delNotification",
			notif.id,
		);
	}

	async acceptGameInvite(server:Server, socket:Socket, id: number)
	{
		const notif = await this.dbNotificationService.returnOne(id);
		if (!notif)
		{
			console.log('Notif not found');
			return ;
		}
					
		const friend = await this.userService.getInfoByNickname(notif.data2);
		const user_id = this.wsSocket.getUserId(socket.id);
		const accept_notif = await this.dbNotificationService.create({
			type: NotificationType.GAME_REQ_ACCEPTED,
			userId: user_id,
			data: await this.getNickname(user_id),
		});
		this.wsSocket.sendToUser(
			server,
			friend.id,
			"getNewNotification",
			accept_notif,
		);
	}

	async declineGameInvite(server:Server, socket:Socket, id: number)
	{
		const notif = await this.dbNotificationService.returnOne(id);
		if (!notif)
		{
			console.log('Notif not found');
			return ;
		}
		const friend = await this.userService.getInfoByNickname(notif.data2);
		const user_id = this.wsSocket.getUserId(socket.id);
		const decline_notif = await this.dbNotificationService.create({
			type: NotificationType.GAME_REQ_DENIED,
			userId: user_id,
			data: await this.getNickname(user_id),
		});
		this.wsSocket.sendToUser(
			server,
			friend.id,
			"getNewNotification",
			decline_notif,
		);
	}

	async removeNotif(socket: Socket, id: number) {
		await this.dbNotificationService.delete(id);
		socket.emit("removeNotification", id);
	}

	async updateNotificationStatus(
		socket: Socket,
		id: number,
		status: NotifStatus,
	) {
		if (!(await this.dbNotificationService.isExist(id))) return;
		await this.dbNotificationService.update(id, { status: status });
		socket.emit("updateNotificationStatus", id);
	}
}
