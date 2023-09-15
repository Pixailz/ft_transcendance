import { AfterViewInit, Component, Input } from '@angular/core';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { NotifStatus, NotificationI } from 'src/app/interfaces/notification.interface';
import { NotificationType } from 'src/app/interfaces/notification.interface';
import { NotificationService } from 'src/app/services/websocket/notification/service';

@Component({
	selector: 'app-flat-list',
	templateUrl: './flat-list.component.html',
	styleUrls: ['./flat-list.component.scss']
})

export class FlatListComponent implements AfterViewInit {
	@Input() notifications: NotificationI[]= [];

	NotificationType = NotificationType;
	constructor (
		public friendService: FriendService,
		public notificationService: NotificationService,
	) {}

	ngAfterViewInit() {
		const scrollArea = document.querySelector('#scrollArea');
		const listItems = document.querySelectorAll('#listItem');
		if (!scrollArea || !listItems)
			return ;
		this.notificationService.createObserver(scrollArea, listItems);
	}

}
