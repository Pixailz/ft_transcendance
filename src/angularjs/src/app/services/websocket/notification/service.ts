import { Injectable } from "@angular/core";
import { DefNotificationI, NotificationI } from "src/app/interfaces/notification.interface";
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
				this.updateAllNotifications(notifications);
			}
		));
	}
	

	updateAllNotifications(notifications: NotificationI[]) {
		if (notifications.length === 0)
			return ;
		this.notif = notifications;
	}

}
