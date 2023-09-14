import { Component, Input } from '@angular/core';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { NotifStatus, NotificationI } from 'src/app/interfaces/notification.interface';
import { NotificationType } from 'src/app/interfaces/notification.interface';

@Component({
	selector: 'app-flat-list',
	templateUrl: './flat-list.component.html',
	styleUrls: ['./flat-list.component.scss']
})

export class FlatListComponent {
	@Input() notifications: NotificationI[]= [];

	NotificationType = NotificationType;
	constructor (
		public friendService: FriendService,
	) {}
}
