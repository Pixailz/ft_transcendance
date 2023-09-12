import { Component, Input } from '@angular/core';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';

@Component({
	selector: 'app-friend-req-denied-from',
	templateUrl: './friend-req-denied-from.component.html',
	styleUrls: ['./friend-req-denied-from.component.scss']
})
export class NotifFriendReqDeniedFromComponent {
	@Input() notif: NotificationI = DefNotificationI;
}
