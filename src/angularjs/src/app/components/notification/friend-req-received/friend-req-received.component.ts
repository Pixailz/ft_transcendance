import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';
import { FriendService } from 'src/app/services/websocket/friend/service';

@Component({
	selector: 'app-friend-req-received',
	templateUrl: './friend-req-received.component.html',
	styleUrls: ['./friend-req-received.component.scss']
})
export class NotifFriendReqReceivedComponent {
	@Input() notif: NotificationI = DefNotificationI;

	constructor(
		public friendService: FriendService,
		) 
	{}
}
