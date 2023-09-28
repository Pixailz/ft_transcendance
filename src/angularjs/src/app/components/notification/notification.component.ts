import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ComponentRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DefNotificationI, NotifStatus, NotificationType } from 'src/app/interfaces/notification.interface';
import { NotificationI } from 'src/app/interfaces/notification.interface';
import { NotifFriendReqReceivedComponent } from './friend-req-received/friend-req-received.component';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/services/websocket/notification/service';
import { TextNotificationComponent } from '../text-notification/text-notification.component';

@Component({
	animations: [
		trigger( 'enterAnimation', [
			transition('void <=> *', animate(0)),
			transition(':enter', [
				style({transform: 'translateX(100%)'}),
				animate('300ms', style({transform: 'translateX(0)'}))
			]),
			transition(':leave', [
				style({transform: 'translateX(0)'}),
				animate('300ms', style({transform: 'translateX(100%)'}))
			])
		]
		)
	],
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent{
	@ViewChild('container', { static: true, read: ViewContainerRef })
		container!: ViewContainerRef;

	private eventCallback = new Subject<string>();
	eventCallback$ = this.eventCallback.asObservable();

	constructor (
		private renderer: Renderer2,
		private notificationService: NotificationService,
	) {
		notificationService.createPopup.subscribe((data: NotificationI) => {
			this.displayNotifications(data);
		});
	}

	displayNotifications(notification: NotificationI) {
		let component: ComponentRef<any> | null = null;
		switch (notification.type) {
			case NotificationType.FRIEND_REQ_RECEIVED:
				component = this.container.createComponent(NotifFriendReqReceivedComponent);
				break;
			case NotificationType.FRIEND_REQ_SENT:
				component = this.container.createComponent(TextNotificationComponent);
				break;
			case NotificationType.FRIEND_REQ_ACCEPTED:
				component = this.container.createComponent(TextNotificationComponent);
				break;
			case NotificationType.FRIEND_REQ_DENIED_FROM:
				component = this.container.createComponent(TextNotificationComponent);
				break;
			case NotificationType.FRIEND_REQ_DENIED_TO:
				component = this.container.createComponent(TextNotificationComponent);
				break;
			default:
				break;
		}
		if (!component)
			return;
		component.instance.notif = notification;
		this.renderer.addClass(component.location.nativeElement, 'notification');
		setTimeout(() => {
			this.container.remove(0);
		}, 5000);
	}


}
