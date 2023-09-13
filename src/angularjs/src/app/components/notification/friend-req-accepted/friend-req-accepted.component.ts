import { Component, Input } from '@angular/core';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';

@Component({
	selector: 'app-friend-req-accepted',
	templateUrl: './friend-req-accepted.component.html',
	styleUrls: ['./friend-req-accepted.component.scss']
})
export class NotifFriendReqAcceptedComponent {
	@Input() notif: NotificationI = DefNotificationI;
}
