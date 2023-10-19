import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ComponentRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { DefNotificationI, NotifStatus, NotificationType } from 'src/app/interfaces/notification.interface';
import { NotificationI } from 'src/app/interfaces/notification.interface';
import { NotifFriendReqReceivedComponent } from './friend-req-received/friend-req-received.component';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/services/websocket/notification/service';
import { TextNotificationComponent } from '../text-notification/text-notification.component';
import { NotifGameInviteComponent } from './game-invite/game-invite.component';
import { NotifAchievementComponent } from './achievement/notif-achievement';


export interface timeoutI {
	notifId: number;
	component: ComponentRef<any>;
}

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
	popupArray : timeoutI[] = [];

	constructor (
		private renderer: Renderer2,
		private notificationService: NotificationService,
	) {
		notificationService.createPopup.subscribe((data: NotificationI) => {
			this.displayNotifications(data);
		});
		notificationService.deletePopup.subscribe((id: number) => {
			console.log('in deletePopup event');
			this.deleteNotif(id)
		});
	}

	displayNotifications(notification: NotificationI) {
		let component: ComponentRef<any> | null = null;
		switch (notification.type) {
			case NotificationType.GAME_REQ:
				component = this.container.createComponent(NotifGameInviteComponent);
				break;
			case NotificationType.ACHIEVEMENT:
				component = this.container.createComponent(NotifAchievementComponent);
				break;
			case NotificationType.FRIEND_REQ_RECEIVED:
			case NotificationType.FRIEND_REQ_DENIED_TO:
			case NotificationType.FRIEND_REQ_SENT:
			case NotificationType.FRIEND_REQ_ACCEPTED:
			case NotificationType.FRIEND_REQ_DENIED_FROM:
			case NotificationType.GAME_REQ_DACCEPT:
			case NotificationType.GAME_REQ_DENIED:
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
			const index = this.container.indexOf(component?.hostView!);
			if (index !== -1)
			{
				const nb = this.searchPopup(notification.id);
				if (nb === -1)
					return ;
				this.popupArray.splice(nb, 1);
				this.container.remove(index);
			}
		}, 5000);
		this.popupArray.push({notifId: notification.id, component: component});
	}


	deleteNotif(id: number)
	{
		const nb = this.searchPopup(id);
		if (nb === -1)
			return ;
		const index = this.container.indexOf(this.popupArray[nb].component.hostView!);
		this.container.remove(index);
		this.popupArray.splice(nb, 1);
	}

	searchPopup(id: number)
	{
		let nb = -1;
		for (let i = 0; i < this.popupArray.length; i++)
		{
			if (this.popupArray[i].notifId === id)
			{
				nb = i;
				break;
			}
		}
		return (nb);
	}
}
