import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Status, UserI } from 'src/app/interfaces/user/user.interface';
import { BackService } from 'src/app/services/back.service';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
	selector: 'app-user-tooltip',
	templateUrl: './user-tooltip.component.html',
	styleUrls: ['./user-tooltip.component.scss']
})
export class UserTooltipComponent {
	@Input() user!: UserI;
	@Input() nickname!: string;
	constructor(
		public friendService: FriendService,
		private wsGateway: WSGateway,
		private back: BackService,
		) {}
	
	async ngOnInit(){
		if (this.nickname && this.user.nickname !== this.nickname) {
			this.user = await this.back.req("GET", `/user/profile/${this.nickname}`);
		}
	}

	doAction() {
		if (this.friendService.isTargetBlocked(this.user.id)) {
			this.wsGateway.unblockUser(this.user.id);
		} else {
			this.wsGateway.blockUser(this.user.id);
		}
	}

	getLiteralStatus()
	{
		switch (this.user.status) {
			case Status.CONNECTED: {
				return 'connected';
			}
			case Status.DISCONNECTED: {
				return 'disconnected';
			}
			case Status.INGAME: {
				return 'ingame';
			}
			case Status.AWAY: {
				return 'away';
			}
			default:
				return "";
		}
	}
}
