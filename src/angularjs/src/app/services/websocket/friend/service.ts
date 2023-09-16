import { Injectable } from "@angular/core";

import { WSGateway } from "../gateway";
import { UserService } from "../../user.service";

import { DefFriendListI, FriendRequestI } from "src/app/interfaces/user/friend.interface";
import { DefUserI, UserI } from "src/app/interfaces/user/user.interface";
import { ChatDmService } from "../chat/direct-message/service";
import { Subscription } from "rxjs";
import { WSService } from "../service";

@Injectable({
	providedIn: "root",
})
export class FriendService {
	friend = DefFriendListI;
	obsToDestroy: Subscription[] = [];
	blocked: any = {};

	constructor(
		private userService: UserService,
		private chatDmService: ChatDmService,
		private wsGateway: WSGateway,
		private wsService: WSService,
	) {
		this.obsToDestroy.push(this.wsGateway.listenAllFriend()
			.subscribe((friends: UserI[]) => {
				console.log("[WS:Friend] AllFriend event")
				this.updateAllFriend(friends);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenAllFriendRequest()
			.subscribe((friend_request: FriendRequestI[]) => {
				console.log("[WS:Friend] AllFriendRequest event")
				this.updateAllFriendRequest(friend_request);
				this.wsGateway.getAllDmRoom();
				this.wsGateway.getAllNotifications();
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenAllBlocked()
			.subscribe((data: UserI[]) => {
				console.log("[WS:Friend] AllBlocked event")
				this.updateAllBlocked(data);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenNewFriend()
			.subscribe((friends: UserI) => {
				console.log("[WS:Friend] NewFriend event")
				this.updateNewFriend(friends);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenNewStatusFriend()
			.subscribe((data: any) => {
				console.log("[WS:Friend] NewStatusFriend event")
				this.updateNewFriendStatus(data);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenNewFriendRequest()
			.subscribe((friend_request: FriendRequestI) => {
				console.log("[WS:Friend] NewFriendRequest event")
				this.updateNewFriendRequest(friend_request);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenDeniedFriendReq()
			.subscribe((friends: UserI) => {
				console.log("[WS:Friend] DeniedFriendReq event")
				this.updateDeniedFriendReq(friends);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenNewBlocked()
			.subscribe((data: UserI) => {
				console.log("[WS:Friend] NewBlocked event")
				this.updateNewBlocked(data);
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenNewUnblocked()
			.subscribe((data: number) => {
				console.log("[WS:Friend] NewUnblocked event")
				this.updateNewUnblocked(data);
			}
		));

		this.wsGateway.getAllFriend();
		this.wsGateway.getAllFriendRequest();
		this.wsGateway.getAllBlocked();
	}

	ngOnDestroy()
	{
		console.log("[WS:Friend] onDestroy");
		this.wsService.unsubscribeObservables(this.obsToDestroy);
	}

	updateAllFriend(friends: UserI[])
	{
		var founded: boolean;

		if (friends.length === 0)
		{
			this.friend.friends = { };
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
	{
		if (this.alreadySend(friend_request.meId))
			return ;
		this.friend.friend_req.push(friend_request);
	}

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

	updateAllBlocked(targets: UserI[]) {
		for (var i = 0; i < targets.length; i++)
		{
			if (!targets[i].id) continue ;
			const tmp_id = targets[i].id.toString();
			if (this.blocked[tmp_id]) continue ;
			this.blocked[tmp_id] = targets[i];
		}
	}

	updateNewBlocked(target: UserI) {
		const target_id_str = target.id.toString();
		if (this.blocked[target_id_str])
			return ;
		this.blocked[target_id_str] = target;
	}

	updateNewUnblocked(target_id: number) {
		const target_id_str = target_id.toString();
		if (!this.blocked[target_id_str])
			return ;
		delete this.blocked[target_id_str];
	}

	getFriendsRequest(): FriendRequestI[]
	{
		var friend_req: FriendRequestI[] = [];

		for (var req of this.friend.friend_req)
			friend_req.push(req);
		return (friend_req);
	}

	getFriends(): UserI[]
	{
		var user_list: UserI[] = [];
		for (var user_id in this.friend.friends)
			user_list.push(this.friend.friends[user_id]);
		return (user_list);
	}

	acceptRequest(friend_id: number)
	{ this.wsGateway.acceptFriendRequest(friend_id); }

	rejectRequest(friend_id: number)
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
		for (var i = 0; i < this.friend.friend_req.length; i++)
			if (this.friend.friend_req[i].friendId === friend_id)
				return (true);
		return (false);
	}

	isBlocked(user_id: number)
	{
		const user_id_str = user_id.toString();

		for (var target_id in this.blocked)
			if (target_id === user_id_str)
				return (true);
		return (false);
	}

	getInfo()
	{
		console.log("[FRIEND]");
		console.log(this.friend);
		console.log(this.blocked);
	}
}

