import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ComponentRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { NotificationType } from 'src/app/interfaces/notification.interface';
import { NotificationI } from 'src/app/interfaces/notification.interface';
import { NotifFriendReqReceivedComponent } from './friend-req-received/friend-req-received.component';
import { NotifFriendReqSentComponent } from './friend-req-sent/friend-req-sent.component';
import { NotifFriendReqAcceptedComponent } from './friend-req-accepted/friend-req-accepted.component';
import { NotifFriendReqDeniedFromComponent } from './friend-req-denied-from/friend-req-denied-from.component';
import { NotifFriendReqDeniedToComponent } from './friend-req-denied-to/friend-req-denied-to.component';


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

	constructor (
		private renderer: Renderer2,
	) {}

	displayNewNotification(notification: NotificationI) {
		let component: ComponentRef<any> | null = null;
		switch (notification.type) {
			case NotificationType.FRIEND_REQ_RECEIVED:
				component = this.container.createComponent(NotifFriendReqReceivedComponent);
				break;
			case NotificationType.FRIEND_REQ_SENT:
				component = this.container.createComponent(NotifFriendReqSentComponent);
				break;
			case NotificationType.FRIEND_REQ_ACCEPTED:
				component = this.container.createComponent(NotifFriendReqAcceptedComponent);
				break;
			case NotificationType.FRIEND_REQ_DENIED_FROM:
				component = this.container.createComponent(NotifFriendReqDeniedFromComponent);
				break;
			case NotificationType.FRIEND_REQ_DENIED_TO:
				component = this.container.createComponent(NotifFriendReqDeniedToComponent);
				break;
			default:
				break;
		}
		if (!component)
			return;
		component.instance.data = notification.data;
		this.renderer.addClass(component.location.nativeElement, 'notification');
		setTimeout(() => {
			this.container.remove(0);
		}, 5000);
	}


	displayNotification(message: string) {
		const container = document.getElementById('container');
		const elem = this.renderer.createElement('div');
		const text = this.renderer.createText(message);
		this.renderer.appendChild(elem, text);
		this.renderer.addClass(elem, 'notification');
		this.renderer.appendChild(container, elem);
		setTimeout(() => {
			this.renderer.removeChild(container, elem);
		}, 5000);
	}
}
