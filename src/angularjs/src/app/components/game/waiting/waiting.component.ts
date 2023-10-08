import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { GameService } from 'src/app/services/websocket/game/service';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { GameInviteDialogComponent } from '../invite-dialog/game-invite-dialog.component';

@Component({
	selector: 'app-game-waiting',
	templateUrl: './waiting.component.html',
	styleUrls: ['./waiting.component.scss']
})
export class GameWaitingComponent {
	inviteLink: string = "";
	inviteRecepeientId: number = -1;
	constructor(
		public gameService: GameService,
		public wsGateway: WSGateway,
		public friendService: FriendService,
		public matDialog: MatDialog,
	) {}
	ngOnInit() {
		this.inviteLink = window.location.origin + "/play/" + this.gameService.roomid;
	}

	sendToFriend(){
		//select friend
		const dialogRef = this.matDialog.open(GameInviteDialogComponent, {
			width: '300px',
			data: this.friendService.getFriends(),
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.inviteRecepeientId = result;
				this.wsGateway.sendGameInvite(result, this.gameService.roomid);
			}
		});
	}
}
