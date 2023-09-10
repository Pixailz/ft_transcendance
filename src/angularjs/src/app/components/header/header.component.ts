import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { DefUserI, FriendRequestI, UserI } from 'src/app/interfaces/chat.interface';
import { WSGateway } from 'src/app/services/ws.gateway';

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
	displayFriendRequest: boolean = false;
	
	constructor(
		private wsGateway: WSGateway,
		private userService: UserService,
		public friendRequestService: FriendRequestService,
	) {}

	async ngOnInit() {
		this.userLoggedIn = await this.userService.checkToken(); 
		this.wsGateway.getAllReqById();
		this.friendRequestService.friends = [];
		
		this.wsGateway.listenAllReqById()
		.subscribe(async (friendReqId: number[]) => {
			console.log("event AllReqById received");
			await this.friendRequestService.updateFriendRequest(friendReqId);
		});

		this.wsGateway.listenNewReqById()
		.subscribe(async (id: number) => {
			console.log("event listenNewReqById received");
			await this.friendRequestService.updateNewFriendReq(id);
		});

		this.wsGateway.listenRemoveFriendReq()
		.subscribe((id: number) => {
			console.log("event listenRemoveFriendReq received");
			this.friendRequestService.removeFriendReq(id)
		})
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
