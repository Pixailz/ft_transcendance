import { Injectable } from '@angular/core';
import { BackService } from "./back.service";
import { UserService } from './user.service';
import { WSGateway } from './WebSocket/gateway';
import { FriendReqStatus } from '../pages/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

	constructor(
		private backService: BackService,
		private userService: UserService,
		private wsGateway: WSGateway,
	) {}

	async acceptRequest(friend_id: number) {
		this.wsGateway.acceptFriendReq(friend_id);
	}

	async rejectFriendReq(friend_id: number) {
		this.wsGateway.rejectFriendReq(friend_id);
	}

	async alreadyFriend(friend_id: number) : Promise<boolean> {
		const already = await this.backService.req("GET", "/db/friend/alreadyFriend/" + friend_id)
		if (already)
			return (true);
		return (false);
	}

	async alreadySend(friend_id: number) {
		const already = await this.backService.req("GET", "/db/friendRequest/sent/" + friend_id);
		if (already)
			return (FriendReqStatus.SENT);
		return (FriendReqStatus.NOTSENT);
	}
}
