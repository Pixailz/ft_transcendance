import { Component, Input } from '@angular/core';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { NotificationI } from '../notification/notification.component';

@Component({
	selector: 'app-flat-list',
	templateUrl: './flat-list.component.html',
	styleUrls: ['./flat-list.component.scss']
})

export class FlatListComponent {
	@Input() notifications: NotificationI[]= [];

	constructor (
		public friendService: FriendService,
	) {}
}
