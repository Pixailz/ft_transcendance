import { Injectable } from "@nestjs/common";
import { WSSocket } from "../socket.service";
import { DBNotificationService } from "src/modules/database/notification/service";
import { Server, Socket } from "socket.io";
import { NotifStatus, NotificationEntity, NotificationType } from "src/modules/database/notification/entity";
import { UserService } from "src/adapter/user/service";
import { DBNotificationPost } from "src/modules/database/notification/dto";

@Injectable()
export class WSNotificationService {
	constructor(
		private userService: UserService,
		public wsSocket: WSSocket,
		private dbNotificationService: DBNotificationService,
	) {}

	async getAllNotifications(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const notifs: NotificationEntity[] = await this.dbNotificationService.getNotifByUserId(user_id);

		socket.emit("getAllNotifications", notifs);
	}

	async sendFriendRequest(server: Server, friend_id: number, user_id: number)
	{
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_SENT,
			userId: user_id,
			data: friend_id.toString(),
		});
		notif_user.data = await this.formatData(friend_id, NotificationType.FRIEND_REQ_SENT);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewNotification",
			notif_user
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
			notif_friend
		);
	}

	async acceptFriendRequest(server: Server, friend_id: number, user_id: number)
	{
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_ACCEPTED,
			userId: user_id,
			data: await this.formatData(friend_id, NotificationType.FRIEND_REQ_ACCEPTED),
		});
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewNotification",
			notif_user
		);

		const notif_friend = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_ACCEPTED,
			userId: friend_id,
			data: await this.formatData(friend_id, NotificationType.FRIEND_REQ_ACCEPTED),
		});
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewNotification",
			notif_friend
		);
		this.delFriendRequest(server, friend_id, user_id);
	}

	async formatData(id:number, type: NotificationType)
	{
		const user = await this.userService.getInfoById(id);
		switch(type){
			case NotificationType.FRIEND_REQ_ACCEPTED :
				return ("New friend: " + user.ftLogin);
			case NotificationType.FRIEND_REQ_DENIED_FROM :
				return ("Friend request from " + user.ftLogin + " denied");
			case NotificationType.FRIEND_REQ_DENIED_TO :
				return ("Friend request to " + user.ftLogin + " denied");
			case NotificationType.FRIEND_REQ_SENT :
				return ("Friend request sent to " + user.ftLogin);
		}
	}

	async rejectFriendRequest(server: Server, friend_id: number, user_id: number)
	{
		const user = await this.userService.getInfoById(friend_id);
		const notif_user = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_DENIED_FROM,
			userId: user_id,
			data: await this.formatData(friend_id, NotificationType.FRIEND_REQ_DENIED_FROM),
		});
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewNotification",
			notif_user
		);

		const friend = await this.userService.getInfoById(user_id);
		const notif_friend = await this.dbNotificationService.create({
			type: NotificationType.FRIEND_REQ_DENIED_TO,
			userId: friend_id,
			data: await this.formatData(user_id, NotificationType.FRIEND_REQ_DENIED_TO),
		});
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewNotification",
			notif_friend
		);
		this.delFriendRequest(server, friend_id, user_id);
	}

	async delFriendRequest(server: Server, friend_id: number, user_id: number)
	{
		const notif_user = await this.dbNotificationService.getNotif(
			friend_id, user_id.toString(), NotificationType.FRIEND_REQ_SENT);
		const notif_friend = await this.dbNotificationService.getNotif(
			user_id, friend_id.toString(), NotificationType.FRIEND_REQ_RECEIVED);

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

	async removeNotif(socket: Socket, id: number)
	{
		await this.dbNotificationService.delete(id);
		socket.emit("removeNotification", id);
	}

	async updateNotificationStatus(socket: Socket, id: number, status: NotifStatus)
	{
		if (!(await this.dbNotificationService.isExist(id)))
			return ;
		await this.dbNotificationService.update(id, {status: status});
		const new_notif = await this.dbNotificationService.returnOne(id);
		socket.emit("updateNotificationStatus", new_notif);
	}
}
