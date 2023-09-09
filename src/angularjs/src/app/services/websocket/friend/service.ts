import { Injectable } from "@angular/core";

import { WSGateway } from "../gateway";
import { UserService } from "../../user.service";

import { DefFriendListI, FriendRequestI } from "src/app/interfaces/friend.interface";
import { DefUserI, UserI } from "src/app/interfaces/user.interface";
import { ChatDmService } from "../chat/direct-message/service";
import { WSService } from "../service";
import { Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class FriendService {
	friend = DefFriendListI;
	obsToDestroy: Subscription[] = [];
	constructor(
		private userService: UserService,
		private chatDmService: ChatDmService,
		private wsService: WSService,
		private wsGateway: WSGateway,
	) {
		this.wsGateway.getAllFriend();
		this.obsToDestroy.push(this.wsGateway.listenAllFriend()
			.subscribe((friends: UserI[]) => {
				console.log("event AllFriend received");
				this.updateAllFriend(friends);
			}
		));

		this.wsGateway.getAllFriendRequest();
		this.obsToDestroy.push(this.wsGateway.listenAllFriendRequest()
			.subscribe((friend_request: FriendRequestI[]) => {
				console.log("event AllFriendRequest received ");
				this.updateAllFriendRequest(friend_request);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenNewFriendRequest()
			.subscribe((friend_request: FriendRequestI) => {
				console.log("event NewFriendRequest received");
				this.updateNewFriendRequest(friend_request);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenNewFriend()
			.subscribe((friends: UserI) => {
				console.log("event NewFriend received");
				this.updateNewFriend(friends);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenDeniedFriendReq()
			.subscribe((friends: UserI) => {
				console.log("event DeniedFriendReq received");
				this.updateDeniedFriendReq(friends);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenNewStatusFriend()
			.subscribe((data: any) => {
				console.log("event NewStatusFriend received")
				this.updateNewFriendStatus(data);
			}
		));
	}

	updateAllFriend(friends: UserI[])
	{
		var founded: boolean;

		if (friends.length === 0)
		{
			this.friend.friends = { "-1": DefUserI };
			return ;
		}
		for (var i = 0; i < friends.length; i++)
		{
			founded = false;
			for (const user_id in this.friend.friends)
			{
				if (friends[i].id === Number(user_id))
				{
					this.friend.friends[user_id] = friends[i];
					founded = true;
					continue ;
				}
			}
			if (!founded)
				this.friend.friends[friends[i].id.toString()] = friends[i];
		}
		this.chatDmService.updateAllFriend(friends);
	}

	updateNewFriend(friend: UserI)
	{
		var founded: boolean = false;

		for (const user_id in this.friend.friends)
		{
			if (friend.id === Number(user_id))
			{
				this.friend.friends[user_id] = friend;
				founded = true;
				continue ;
			}
		}
		if (!founded)
			this.friend.friends[friend.id.toString()] = friend,
		this.chatDmService.updateNewFriend(friend);
		this.updateDeniedFriendReq(
					{user_id: this.userService.user.id, target_id: friend.id});
	}

	updateAllFriendRequest(friend_request: FriendRequestI[])
	{
		this.friend.friend_req = [];
		for (var friend_req of friend_request)
			this.friend.friend_req.push(friend_req);
	}

	updateNewFriendRequest(friend_request: FriendRequestI)
	{ this.friend.friend_req.push(friend_request); }

	updateDeniedFriendReq(data: any)
	{
		for (var i = 0; i < this.friend.friend_req.length; i++)
			if (this.friend.friend_req[i].meId === data.target_id &&
				this.friend.friend_req[i].friendId === data.user_id)
				this.friend.friend_req.splice(i, 1);
	}

	updateNewFriendStatus(friends_status: any) {
		if (!this.userService.isGoodUser(this.friend.friends[friends_status.user_id]))
			return ;
		this.friend.friends[friends_status.user_id].status = friends_status.status;
	}

	getFriendsRequest(): UserI[]
	{
		var user_list: UserI[] = [];

		for (var req of this.friend.friend_req)
			if (req.meId !== this.userService.user.id)
				user_list.push(req.me);
		return (user_list);
	}

	acceptRequest(friend_id: number)
	{ this.wsGateway.acceptFriendRequest(friend_id); }

	rejectFriendReq(friend_id: number)
	{ this.wsGateway.rejectFriendRequest(friend_id); }

	alreadyFriend(friend_id: number)
	{
		const friend_id_str = friend_id.toString();

		for (var friends_id in this.friend.friends)
			if (friends_id === friend_id_str)
				return (true);
		return (false);
	}

	alreadySend(friend_id: number)
	{
		for (var req of this.friend.friend_req)
			if (req.meId === friend_id ||
				req.friendId === friend_id)
				return (true);
		return (false);
	}

	getInfo()
	{
		console.log(this.friend);
	}
}

