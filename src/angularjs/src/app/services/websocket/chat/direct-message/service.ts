import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";


import { WSGateway } from "../../gateway";
import { ChatRoomService } from "../chatroom.service";
import { DefUserI, UserI } from "src/app/interfaces/user/user.interface";
import { WSService } from "../../service";
import { DefUserChatRoomI } from "src/app/interfaces/chat/user-chat-room.interface";
import { DefChatDmI } from "src/app/interfaces/chat/dm.interface";
import { ChatRoomI, DefChatRoomI } from "src/app/interfaces/chat/chat-room.interface";

@Injectable({
	providedIn: "root",
})
export class ChatDmService {
	chat = DefChatDmI;
	obsToDestroy: Subscription[] = [];

	constructor(
		private chatRoomService: ChatRoomService,
		private wsService: WSService,
		private wsGateway: WSGateway,
	) {
		this.obsToDestroy.push(this.wsGateway.listenAllDmRoom()
			.subscribe((rooms: ChatRoomI[]) => {
				console.log("[WS:DM] AllChatDm event")
				this.updateAllChatDm(rooms);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenNewDmRoom()
			.subscribe((room: ChatRoomI) => {
				console.log("[WS:DM] NewDmRoom event")
				this.updateNewChatDm(room);
			}
		));

		this.obsToDestroy.push(this.wsGateway.listenNewDmMessage()
			.subscribe((data: any) => {
				console.log("[WS:DM] NewDmMessage event")
				this.updateNewDmMessage(data);
			}
		));
	}

	ngOnDestroy()
	{
		console.log("[WS:ChatDM] onDestroy")
		this.wsService.unsubscribeObservables(this.obsToDestroy);
	}

	updateAllChatDm(chatroom: ChatRoomI[])
	{
		var found: boolean;

		for (var i = 0; i < chatroom.length; i++)
		{
			found = false;
			const	array_chat_room = chatroom[i].roomInfo;
			if (!array_chat_room || !array_chat_room[0])
				continue ;

			for (const friend_id in this.chat.dm)
			{
				if (Number(friend_id) === array_chat_room[0].userId)
				{
					found = true;
					this.chat.dm[friend_id].room = chatroom[i];
				}
			}
			if (!found)
				this.chat.dm[array_chat_room[0].user.id.toString()] = {
					user_info: DefUserI,
					room: chatroom[i],
				}
		}
	}

	updateAllFriend(friends: UserI[])
	{
		var founded: boolean;

		for (var i = 0; i < friends.length; i++)
		{
			founded = false;
			for (const friend_id in this.chat.dm)
			{
				if (Number(friend_id) === friends[i].id)
				{
					this.chat.dm[friend_id].user_info = friends[i];
					founded = true;
					break ;
				}
			}
			if (!founded)
				this.chat.dm[friends[i].id.toString()] = {
					user_info: friends[i],
					room: DefUserChatRoomI,
				};
		}
	}

	updateNewChatDm(chatroom: ChatRoomI)
	{
		if (!chatroom.roomInfo)
			return ;
		for (const friend_id in this.chat.dm)
			if (this.chat.dm[friend_id].user_info.id === chatroom.roomInfo[0].userId)
				this.chat.dm[friend_id].room = chatroom;
	}

	updateNewFriend(friends: UserI)
	{
		var founded: boolean;

		founded = false;
		for (const friend_id in this.chat.dm)
		{
			if (Number(friend_id) === friends.id)
			{
				this.chat.dm[friend_id].user_info = friends;
				founded = true;
				break ;
			}
		}
		if (!founded)
			this.chat.dm[friends.id.toString()] = {
				user_info: friends,
				room: DefUserChatRoomI,
			};
	}

	updateNewDmMessage(message: any)
	{
		for (const friend_id in this.chat.dm)
		{
			if (this.chat.dm[friend_id].room.id == message.room_id)
			{
				this.chat.dm[friend_id].room.message.push(message.message);
				break ;
			}
		}
	}

	updateSelectedDm(friend: any)
	{
		this.chat.selected_dm_id = friend.user_info.id.toString();
		this.chat.selected_dm = friend;
	}

	getSelectedDm(): any
	{
		if (!this.isGoodSelectedRoom())
			return DefChatRoomI;
		return this.chat.selected_dm;
	}

	getFriends()
	{
		var user_list: any[] = [];

		for (var i in this.chat.dm)
			if (this.chat.dm[i].room.roomId === -1)
				user_list.push(this.chat.dm[i]);
		return (user_list);
	}

	getFriendsRoom()
	{
		var user_list: any[] = [];

		for (var i in this.chat.dm)
			if (this.chat.dm[i].room.roomId !== -1)
				user_list.push(this.chat.dm[i]);
		return (user_list);
	}

	isGoodSelectedRoom(): boolean
	{
		if (this.chat.selected_dm_id === "-1" ||
			!this.chatRoomService.isGoodRoom(this.chat.dm[this.chat.selected_dm_id]))
			return (false);
		return (true);
	}

	getInfo()
	{
		console.log("[DM]");
		console.log(this.chat);
	}
}
