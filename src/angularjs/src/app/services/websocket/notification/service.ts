import { Injectable } from "@angular/core";
import { NotificationI } from "src/app/interfaces/notification.interface";
import { WSGateway } from "../gateway";
import { Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	notif: NotificationI[] = [];
	obsToDestroy: Subscription[] = [];

	constructor (
		private wsGateway: WSGateway,

	){
		this.wsGateway.getAllNotifications();
		this.obsToDestroy.push(this.wsGateway.listenAllNotifications()
			.subscribe((notifications: NotificationI[]) => {
				console.log("event AllNotifications received");
				console.log('notif = ', notifications)
				this.updateAllNotifications(notifications);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenNewNotification()
		.subscribe((notification: NotificationI) => {
			console.log("event New Notification received");
			this.updateNewNotification(notification);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenRemoveNotification()
		.subscribe((notificationId: number) => {
			console.log("event New Notification received");
			this.updateRemoveNotification(notificationId);
			}
		));
	}
	
	updateRemoveNotification(id: number)
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

	updateNewNotification(notification: NotificationI) {
		this.notif.push(notification);
	}

	updateAllNotifications(notifications: NotificationI[]) {
		if (notifications.length === 0)
			return ;
		this.notif = notifications;
	}

}
