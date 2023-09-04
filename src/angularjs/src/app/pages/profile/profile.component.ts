import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/chat.interface';
import { BackService } from 'src/app/services/back.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';

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
	) {}

	ngOnInit() {
		this.route.params.subscribe(async params => {
			await this.back.req("GET", "/user/profile/" + params['login'])
				.then(async (data) => {
					this.user_info = data;
					this.alreadyFriend = await this.friendRequestService.alreadyFriend(this.user_info.id);
					console.log("user info = ", this.user_info);
				})
				.catch((err) => {
					console.log("[profile]", err.status);
				})
		});
	}

	async sendFriendRequest() {
		console.log("Call send Friend Request in profile compo\n");
		await this.friendRequestService.sendFriendRequest(this.user_info.id);
	}
}
