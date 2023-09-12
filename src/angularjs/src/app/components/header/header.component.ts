import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { NotificationI } from '../notification/notification.component';

@Component({
  selector: 'app-header',
  animations: [
    trigger(
      'enterAnimation', [
		state('true', style({})),
		state('false', style({})),

		transition('void <=> false', animate(0)),

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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	userLoggedIn = true;
	isExpand = false;
	displayFriendRequest: boolean = false;
	notifications: NotificationI[] = [];

	constructor(
		public friendService: FriendService,
		private userService: UserService,
	) {}

	async ngOnInit() {
		this.notifications.push({type: 'text', data: {message: 'test'}})
		this.notifications.push({type: 'text', data: {message: 'test'}})
		this.notifications.push({type: 'text', data: {message: 'test'}})
		this.notifications.push({type: 'text', data: {message: 'test'}})
		this.notifications.push({type: 'text', data: {message: 'test'}})
		this.notifications.push({type: 'text', data: {message: 'test'}})
		this.notifications.push({type: 'friendReq', data: {ft_login: 'rrollin', id: 'id'}})
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
