import { Injectable } from "@angular/core";
import { DefNotificationI, NotificationI, NotificationType } from "src/app/interfaces/notification.interface";
import { WSGateway } from "../gateway";
import { Subscription } from "rxjs";
import { WSService } from "../service";
import { FriendService } from "../friend/service";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	notif: NotificationI[] = [];
	obsToDestroy: Subscription[] = [];

	constructor (
		private friendService: FriendService,
		private wsGateway: WSGateway,
		private wsService: WSService,
	){ }

	onInit()
	{
		this.obsToDestroy.push(this.wsGateway.listenAllNotifications()
			.subscribe((notifications: NotificationI[]) => {
				console.log("[WS:Notification] AllNotifications event")
				this.updateAllNotifications(notifications);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenNewNotification()
			.subscribe((notification: NotificationI) => {
				console.log("[WS:Notification] NewNotification event")
				this.updateNewNotification(notification);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenDelNotification()
			.subscribe((notif_id: number) => {
				console.log("[WS:Notification] DelNotification event")
				this.updateDelNotification(notif_id);
				}
			));
	}

	onDestroy()
	{
		console.log("[WS:Notification] onDestroy");
		this.wsService.unsubscribeObservables(this.obsToDestroy);
	}

	getNotifFriendSent(notification: any): NotificationI
	{
		const friend_req = this.friendService.getFriendsRequest();
		const friend_id = Number(notification.data);
		var	notif: NotificationI = notification;

		for (var i = 0; i < friend_req.length; i++)
		{
			if (friend_req[i].friendId === friend_id)
			{
				notif.data = {
					friend: friend_req[i].friend,
				}
				continue ;
			}
		}
		return (notif);
	}

	getNotifFriendReceived(notification: any): NotificationI
	{
		const friend_req = this.friendService.getFriendsRequest();
		const user_id = Number(notification.data);
		var	notif: NotificationI = notification;

		for (var i = 0; friend_req.length; i++)
		{
			if (friend_req[i].meId === user_id)
				notif.data = {
					from: friend_req[i].me,
				}
			break ;
		}
		return (notif);
	}

	getNotifFriendAccepted(notification: any): NotificationI
	{
		var	notif: NotificationI = notification;

		if (this.friendService.friend.friends[notification.data])
			notif.data = {
				friend: this.friendService.friend.friends[notification.data],
			}
		return (notif);
	}

	getNotification(notification: any): NotificationI
	{
		var notif: NotificationI = DefNotificationI;

		switch(notification.type) {
			case (NotificationType.FRIEND_REQ_SENT): {
				notif = this.getNotifFriendSent(notification);
				break ;
			}
			case (NotificationType.FRIEND_REQ_RECEIVED): {
				notif = this.getNotifFriendReceived(notification);
				break ;
			}
			case (NotificationType.FRIEND_REQ_ACCEPTED): {
				notif = this.getNotifFriendAccepted(notification);
				break ;
			}
			case (NotificationType.FRIEND_REQ_DENIED_FROM):
			case (NotificationType.FRIEND_REQ_DENIED_TO): {
				notif = notification;
				break ;
			}
		}
		return (notif);
	}

	updateAllNotifications(notifications: any[]) {
		if (notifications.length === 0)
			return ;
		for (var i = 0; i < notifications.length; i++)
			this.notif.push(this.getNotification(notifications[i]));
	}

	updateNewNotification(notification: any)
	{ this.notif.push(this.getNotification(notification)); }

	updateDelNotification(id: number)
	{
		for (let i = 0; i < this.notif.length ; i++)
		{
			if (this.notif[i].id === id)
			{
				this.notif.splice(i, 1);
				return ;
			}
		}
	}

	getInfo()
	{
		console.log("[NOTIFICATION]");
		console.log(this.notif);
	}
}
