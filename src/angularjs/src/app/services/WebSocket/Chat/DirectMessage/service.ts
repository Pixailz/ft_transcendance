import { Injectable } from "@angular/core";

import { ChatRoomI, DefChatRoomI, MessageI } from "src/app/interfaces/chat-room.interface";
import { DefChatDmI } from "src/app/interfaces/chat-dm.interface";

import { WSGateway } from "../../gateway";
import { ChatRoomService } from "../chat-room.service";
import { UserI } from "src/app/interfaces/user.interface";
import { DefUserChatRoomI } from "src/app/interfaces/user-chat-room.interface";

@Injectable({
	providedIn: "root",
})
export class ChatDmService {
	constructor(
		private chatRoomService: ChatRoomService,
		private wsGateway: WSGateway,
	) {}

	chat = DefChatDmI;

	ngOnInit()
	{
		this.wsGateway.getAllDmRoom();
		this.wsGateway.listenAllDmRoom()
			.subscribe((rooms: ChatRoomI[]) => {
				console.log("event AllChatDm received")
				this.updateAllChatDm(rooms);
			}
		)

		this.wsGateway.listenNewDmRoom()
			.subscribe((room: ChatRoomI) => {
				console.log("event NewDmRoom received")
				this.updateNewChatDm(room);
			}
		)

		this.wsGateway.listenNewDmMessage()
			.subscribe((data: any) => {
				console.log("event NewDmMessage received")
				this.updateNewDmMessage(data);
			}
		)
	}

	updateAllChatDm(chatroom: ChatRoomI[])
	{
		for (var i = 0; i < chatroom.length; i++)
		{
			for (const friend_id in this.chat.dm)
			{
				const	array_chat_room = chatroom[i].roomInfo;
				if (!array_chat_room || !array_chat_room[0])
					continue ;
				if (Number(friend_id) === array_chat_room[0].user.id)
					this.chat.dm[friend_id].room = chatroom[i];
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
			this.chat.dm[friends.id.toString()] = friends;
	}

	updateNewDmMessage(message: any)
	{
		for (const friend_id in this.chat.dm)
		{
			if (this.chat.dm[friend_id].room.roomId == message.roomId)
			{
				this.chat.dm[friend_id].room.message.push(message.message);
				if (this.chat.selected_dm.room.roomId === Number(this.chat.selected_dm_id))
					this.chat.selected_dm.message.push(message.message);
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
		const	selected_dm = this.getSelectedDm();

		// console.clear();

		console.log(this.chat);

		if (selected_dm.id === -1)
			console.log("[onGetInfo] selected_dm not found");
		else
			console.log("[onGetInfo] selected_dm", selected_dm);
	}

}
