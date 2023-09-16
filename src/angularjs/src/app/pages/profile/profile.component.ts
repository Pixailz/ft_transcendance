import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/user/user.interface';
import { BackService } from 'src/app/services/back.service';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { UserService } from 'src/app/services/user.service';


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
	user_id : number = -1;
	constructor(
		private route: ActivatedRoute,
		private back: BackService,
		public userService: UserService,
		public friendService: FriendService,
		public wsGateway: WSGateway,
	) {}


	async ngOnInit() {
		this.user_info = await this.back.req("GET",
			"/user/profile/" + this.route.snapshot.paramMap.get("login"))
			.catch((err) => {
				console.log("[profile]", err.status);
			});
		this.user_id = (await this.userService.getUserInfo()).id;
	}

	sendFriendRequest(id: number)
	{ this.wsGateway.sendFriendRequest(id); }

	blockUser(id: number)
	{ this.wsGateway.blockUser(id); }

	unblockUser(id: number)
	{ this.wsGateway.unblockUser(id); }
}
