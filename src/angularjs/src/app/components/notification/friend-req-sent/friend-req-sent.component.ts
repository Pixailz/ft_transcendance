import { Component, Input } from '@angular/core';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';

@Component({
	selector: 'app-friend-req-sent',
	templateUrl: './friend-req-sent.component.html',
	styleUrls: ['./friend-req-sent.component.scss']
})
export class NotifFriendReqSentComponent {
	@Input() notif: NotificationI = DefNotificationI;
}
