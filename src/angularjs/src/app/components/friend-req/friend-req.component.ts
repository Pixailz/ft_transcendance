import { Component, Input } from '@angular/core';
import { NotificationI } from 'src/app/interfaces/notification.interface';
import { FriendService } from 'src/app/services/websocket/friend/service';

@Component({
  selector: 'app-friend-req',
  templateUrl: './friend-req.component.html',
  styleUrls: ['./friend-req.component.scss']
})
export class FriendReqComponent {
	@Input() notif: NotificationI = {id: -1, type: 0, data: {}};

	constructor(public friendService: FriendService) {}
}
