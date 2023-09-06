import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';
import { ChatService } from 'src/app/services/chat.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { BackService } from 'src/app/services/back.service';
import { WSGateway } from 'src/app/services/ws.gateway';

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
		public chatService: ChatService,
		public wsGateway: WSGateway,
	) {}

	ngOnInit() {
		this.route.params.subscribe(async params => {
			await this.back.req("GET", "/user/profile/" + params['login'])
				.then(async (data) => {
					this.user_info = data;
					this.alreadyFriend = await this.friendRequestService.alreadyFriend(this.user_info.id);
				})
				.catch((err) => {
					console.log("[profile]", err.status);
				})
		});
	}

	
	sendFriendRequest(id: number) {
		this.wsGateway.sendFriendReq(id);
	}
}
