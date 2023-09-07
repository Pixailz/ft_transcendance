import { Component, Input } from '@angular/core';
import { FriendService } from 'src/app/services/websocket/friend/service';

@Component({
  selector: 'app-friend-req',
  templateUrl: './friend-req.component.html',
  styleUrls: ['./friend-req.component.scss']
})
export class FriendReqComponent {
	@Input() data = {ft_login: '', id: -1};

	constructor(public friendService: FriendService) {}
}
