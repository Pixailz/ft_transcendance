import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { WSGateway } from 'src/app/services/WebSocket/gateway';
import { FriendService } from 'src/app/services/WebSocket/Friend/service';

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

	constructor(
		public friendService: FriendService,
		private userService: UserService,
	) {}

	async ngOnInit() {
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
