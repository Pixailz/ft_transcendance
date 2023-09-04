import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { FriendRequestI, UserI } from 'src/app/interfaces/chat.interface';

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
	userLoggedIn = false;
	isExpand = false;
	friend: UserI[] = [];
	displayFriendRequest: boolean = false;
	constructor(
		private userService: UserService,
		public friendRequestService: FriendRequestService,
	) {}

	async ngOnInit() {
		this.userLoggedIn = await this.userService.checkToken(); 
		const requests = await this.friendRequestService.getRequest();
		for (let i = 0; i < requests.length; i++)
		{
			let user = await this.userService.getUserInfoById(requests[i].meId);
			this.friend.push(user);
		} 
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
