import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefUserI, UserI } from 'src/app/interfaces/user/user.interface';
import { BackService } from 'src/app/services/back.service';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';


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
	games_infos: { totalGames: number, totalWins: number, winRatio: number, elo: number };
	subscription: any = null;
	math = Math;
	constructor(
		private route: ActivatedRoute,
		private back: BackService,
		public userService: UserService,
		public friendService: FriendService,
		public wsGateway: WSGateway,
		public matDialog: MatDialog
	) {}


	async ngOnInit() {
		this.user_info = await this.back.req("GET",
			"/user/profile/" + this.route.snapshot.paramMap.get("login"))
			.catch((err) => {
				console.log("[profile]", err.status);
			});
		if (!this.user_info) return;
		this.user_id = (await this.userService.getUserInfo()).id;
		this.games_infos = await this.back.req("GET",
			"/game/stats/" + this.user_info.id)
			.catch((err) => {
				console.log("[profile]", err.status);
			});
		if (this.subscription) return;
		this.subscription = this.route.params.subscribe(params => {
			if (params['login'] != this.user_info.ftLogin && this.user_id != -1){
				this.ngOnInit();
			}
		});
	}

	openEditDialog() {
		const dialogRef = this.matDialog.open(UserProfileComponent);
		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	sendFriendRequest(id: number)
	{ this.wsGateway.sendFriendRequest(id); }

	blockUser(id: number)
	{ this.wsGateway.blockUser(id); }

	unblockUser(id: number)
	{ this.wsGateway.unblockUser(id); }
}
