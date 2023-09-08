import { Injectable, OnInit } from "@angular/core";

import { WSGateway } from "../gateway";
import { UserService } from "../../user.service";

import { DefFriendListI, FriendRequestI } from "src/app/interfaces/friend.interface";
import { DefUserI, UserI } from "src/app/interfaces/user.interface";
import { ChatDmService } from "../Chat/DirectMessage/service";

@Injectable({
	providedIn: "root",
})
export class FriendService implements OnInit {
	constructor(
		private userService: UserService,
		private chatDmService: ChatDmService,
		private wsGateway: WSGateway,
	) {}

	friend = DefFriendListI;

	ngOnInit()
	{
		this.wsGateway.getAllFriend();
		this.wsGateway.listenAllFriend()
			.subscribe((friends: UserI[]) => {
				console.log("event AllFriend received");
				this.updateAllFriend(friends);
			}
		)

		this.wsGateway.getAllFriendRequest();
		this.wsGateway.listenAllFriendRequest()
			.subscribe((friend_request: FriendRequestI[]) => {
				console.log("event AllFriendRequest received ");
				this.updateAllFriendRequest(friend_request);
			}
		)

		this.wsGateway.listenNewFriendRequest()
			.subscribe((friend_request: FriendRequestI) => {
				console.log("event NewFriendRequest received");
				this.updateNewFriendRequest(friend_request);
			}
		)

		this.wsGateway.listenNewFriend()
			.subscribe((friends: UserI) => {
				console.log("event NewFriend received");
				this.updateNewFriend(friends);
			}
		)

		this.wsGateway.listenNewStatusFriend()
			.subscribe((data: any) => {
				console.log("event NewStatusFriend received")
				this.updateNewFriendStatus(data);
			}
		)
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

	updateAllFriendRequest(friend_request: FriendRequestI[])
	{
		for (var friend_req of friend_request)
			this.friend.friend_req[friend_req.friendId] = friend_req;
	}

	updateNewFriendRequest(friend_request: FriendRequestI)
	{ this.friend.friend_req[friend_request.friendId] = friend_request; }

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
			this.friend.friends[friend.id.toString()] = friend;
		this.chatDmService.updateNewFriend(friend);
	}

	updateNewFriendStatus(friends_status: any) {
		if (!this.userService.isGoodUser(this.friend.friends[friends_status.user_id]))
			return ;
		this.friend.friends[friends_status.user_id].status = friends_status.status;
	}

	getInfo()
	{
		console.log(this.friend);
	}
}

