import { Component, Input } from '@angular/core';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';

@Component({
	selector: 'app-friend-req-denied-to',
	templateUrl: './friend-req-denied-to.component.html',
	styleUrls: ['./friend-req-denied-to.component.scss']
})
export class NotifFriendReqDeniedToComponent {
	@Input() notif: NotificationI = DefNotificationI;
}
