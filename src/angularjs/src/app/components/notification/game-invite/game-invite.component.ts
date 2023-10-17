import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
	selector: 'app-game-invite',
	templateUrl: './game-invite.component.html',
	styleUrls: ['./game-invite.component.scss']
})
export class NotifGameInviteComponent {
	@Input() notif: NotificationI = DefNotificationI;

	constructor(
		public router: Router,
		public wsGateway: WSGateway,
	)
	{}

	accept(){
		this.wsGateway.acceptGameInvite(this.notif.id);
		this.wsGateway.delGameInvite(this.notif.id);
		this.router.navigate(["/play", this.notif.data], { replaceUrl: true });
	}

	reject(){
		this.wsGateway.declineGameInvite(this.notif.id);
		this.wsGateway.delGameInvite(this.notif.id);
	}

	delete(){
		this.wsGateway.delGameInvite(this.notif.id);
	}
}
