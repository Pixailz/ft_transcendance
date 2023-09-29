import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NotificationService } from 'src/app/services/websocket/notification/service';
import { enterAnimation, fadeInOut } from 'src/app/animations';
@Component({
  selector: 'app-header',
  animations: [ enterAnimation, fadeInOut ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	userLoggedIn: boolean = true;
	isExpand: boolean = false;
	displayNotifications: boolean = false;

	constructor(
		private userService: UserService,
		public notificationService: NotificationService
		) {}

	OnNotificationClick()
	{
		this.displayNotifications = !this.displayNotifications;
		if (!this.displayNotifications)
			this.notificationService.deleteNotif();
	}

	SignOut()
	{ this.userService.SignOut(); }

	isSmallDevice() {
		return (window.innerWidth < 700);
	}

	onResize() {
		if (!this.isSmallDevice())
			this
			.isExpand = false;
	}
}
