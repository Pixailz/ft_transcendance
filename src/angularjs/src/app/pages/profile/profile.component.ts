import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/user.interface';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { BackService } from 'src/app/services/back.service';
import { WSGateway } from 'src/app/services/WebSocket/gateway';
import { FriendService } from 'src/app/services/WebSocket/Friend/service';


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

	constructor(
		private route: ActivatedRoute,
		private back: BackService,
		public friendRequestService: FriendRequestService,
		public friendService: FriendService,
		public wsGateway: WSGateway,
	) {}


	async ngOnInit() {
		this.user_info = await this.back.req("GET",
			"/user/profile/" + this.route.snapshot.paramMap.get("login"))
			.catch((err) => {
				console.log("[profile]", err.status);
			});
	}

	onGetInfo()
	{ this.friendService.getInfo(); }

	sendFriendRequest(id: number)
	{ this.wsGateway.sendFriendReq(id); }
}
