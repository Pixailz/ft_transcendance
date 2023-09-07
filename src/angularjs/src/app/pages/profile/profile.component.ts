import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { BackService } from 'src/app/services/back.service';
import { WSGateway } from 'src/app/services/ws.gateway';


export enum FriendReqStatus {
	NOTSENT,
	SENT,
	ALREADYFRIEND,
}

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	user_info: UserI = DefUserI;
	alreadyFriend: boolean = true;
	requestStatus: Number = 1;

	constructor(
		private route: ActivatedRoute,
		private back: BackService,
		public friendRequestService: FriendRequestService,
		public wsGateway: WSGateway,
	) {}


	ngOnInit() {
		this.route.params.subscribe(async params => {
			await this.back.req("GET", "/user/profile/" + params['login'])
				.then(async (data) => {
					this.user_info = data;
					this.requestStatus = await this.friendRequestService.alreadySend(this.user_info.id);
					this.alreadyFriend = await this.friendRequestService.alreadyFriend(this.user_info.id);
					if (this.alreadyFriend == true)
						this.requestStatus = FriendReqStatus.ALREADYFRIEND;
				})
				.catch((err) => {
					console.log("[profile]", err.status);1
				})
			});
		this.wsGateway.listenReqStatus()
		.subscribe(async(status: FriendReqStatus) => {
			console.log('event listenReqStatus received');
			this.requestStatus = status;
			console.log('my status = ', this.requestStatus);
		});
		// this.alreadyFriend = await this.friendRequestService.alreadyFriend(this.user_info.id);
	}


	sendFriendRequest(id: number) {
		this.wsGateway.sendFriendReq(id);
	}
}
