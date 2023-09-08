import { Injectable, OnInit } from "@angular/core";

import { UserService } from "src/app/services/user.service";
import { WSGateway } from "../../gateway";

import { DefChatChannelI, RoomAction } from "src/app/interfaces/chat-channel.interface";
import { ChatRoomI, DefChatRoomI, RoomType } from "src/app/interfaces/chat-room.interface";
import { UserChatRoomI } from "src/app/interfaces/user-chat-room.interface";
import { ChatRoomService } from "../chat-room.service";
import { UserI } from "src/app/interfaces/user.interface";

@Injectable({
	providedIn: "root",
})
export class ChatChannelService implements OnInit {
	constructor(
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		private wsGateway: WSGateway,
	) {}

	chat = DefChatChannelI;

	ngOnInit()
	{
		this.wsGateway.getAllAvailableChannelRoom();
		this.wsGateway.listenAllAvailableChannelRoom().subscribe((data: ChatRoomI[]) => {
			console.log("event AllAvailableChannelRoom received");
			this.updateAllAvailableChannelRoom(data);
		})

		this.wsGateway.listenNewGlobalMessage().subscribe((data: any) => {
			console.log("event getNewGlobalMessage received");
			this.updateNewGlobalMessage(data);
		});

		this.wsGateway.listenNewUserJoinChannelRoom().subscribe((data: UserChatRoomI) => {
			console.log("event NewUserJoinChannelRoom received");
			this.updateNewUserJoinChannelRoom(data);
		})

		this.wsGateway.listenNewDetailsChannelRoom().subscribe((data: ChatRoomI) => {
			console.log("event NewDetailsChannelRoom received");
			this.updateNewDetailsChannelRoom(data);
		})

		this.wsGateway.listenRoomAction().subscribe((data: any) => {
			console.log("event RoomAction");
			this.updateRoomAction(data);
		})

		this.wsGateway.listenNewJoinedChannelRoom().subscribe((data: ChatRoomI) => {
			console.log("event NewJoinedChannelRoom received");
			this.updateNewJoinedChannelRoom(data);
		})

		this.wsGateway.listenNewAvailableChannelRoom().subscribe((data: ChatRoomI) => {
			console.log("event NewAvailableChannelRoom received");
			this.updateNewAvailableChannelRoom(data);
		})

		this.wsGateway.getAllJoinedChannelRoom();
		this.wsGateway.listenAllJoinedChannelRoom().subscribe((data: ChatRoomI[]) => {
			console.log("event AllJoinedChannelRoom received");
			this.updateAllJoinedChannelRoom(data);
		})
	}

	updateAllAvailableChannelRoom(chatroom: ChatRoomI[])
	{
		var founded: boolean;

		if (chatroom.length === 0 || chatroom[0] === null)
		{
			this.chat.available_room = [ DefChatRoomI ]
			return ;
		}
		for (var i = 0; i < chatroom.length; i++)
		{
			founded = false;
			for (const room_id in this.chat.available_room)
			{
				if (chatroom[i].id === Number(room_id))
				{
					this.chat.available_room[room_id] = chatroom[i];
					founded = true;
					continue ;
				}
			}
			if (!founded)
				this.chat.available_room[chatroom[i].id.toString()] = chatroom[i]
		}
	}

	updateAllJoinedChannelRoom(chatroom: ChatRoomI[])
	{
		var founded: boolean;

		if (chatroom.length === 0)
		{
			this.chat.joined_room = [ DefChatRoomI ]
			return ;
		}
		for (var i = 0; i < chatroom.length; i++)
		{
			founded = false;
			for (const room_id in this.chat.joined_room)
			{
				if (chatroom[i].id === Number(room_id))
				{
					this.chat.joined_room[room_id] = chatroom[i];
					founded = true;
					continue ;
				}
			}
			if (!founded)
				this.chat.joined_room[chatroom[i].id.toString()] = chatroom[i]
		}
	}

	updateNewAvailableChannelRoom(chatroom: ChatRoomI)
	{
		var founded: boolean;

		founded = false;
		for (const room_id in this.chat.available_room)
		{
			if (chatroom.id === Number(room_id))
			{
				this.chat.available_room[room_id] = chatroom;
				founded = true;
				continue ;
			}
		}
		if (!founded)
			this.chat.available_room[chatroom.id.toString()] = chatroom
	}

	updateNewJoinedChannelRoom(chatroom: ChatRoomI)
	{
		var found: boolean;

		found = false;
		for (const room_id in this.chat.joined_room)
		{
			if (chatroom.id === Number(room_id))
			{
				this.chat.joined_room[room_id] = chatroom;
				found = true;
				continue ;
			}
		}
		if (!found)
			this.chat.joined_room[chatroom.id.toString()] = chatroom
		if (this.chat.available_room[chatroom.id])
			delete this.chat.available_room[chatroom.id];
	}

	updateNewGlobalMessage(data: any)
	{
		this.chat.joined_room[data.room_id].message.push(data.message);
		if (this.chat.selected_room_id === data.room_id)
			this.chat.selected_room.message.push(data.message);
	}

	updateNewUserJoinChannelRoom(user_chatroom: UserChatRoomI)
	{ this.chat.joined_room[user_chatroom.roomId].roomInfo.push(user_chatroom); }

	updateNewDetailsChannelRoom(chatroom: ChatRoomI)
	{
		var target = this.chat.joined_room[chatroom.id];
		if (this.chat.joined_room[chatroom.id])
		{
			if (target.name !== chatroom.name) target.name = chatroom.name;
			if (target.type !== chatroom.type) target.type = chatroom.type;
			if (target.roomInfo !== chatroom.roomInfo) target.roomInfo = chatroom.roomInfo;
			if (target.message !== chatroom.message) target.message = chatroom.message;
		}
	}

	updateRoomActionKick(target_id: number, room_id: number)
	{
		if (target_id === this.userService.user.id)
		{
			if (this.chat.joined_room[room_id])
			{
				delete this.chat.joined_room[room_id];
				if (Number(this.chat.selected_room_id) === room_id)
				{
					this.chat.selected_room = DefChatRoomI;
					this.chat.selected_room_id = "-1";
				}
			}
		}
		else
		{
			const room = this.chat.joined_room[room_id];
			if (room && room.roomInfo)
			{
				for (var i = 0; i < room.roomInfo.length; i++)
				{
					if (room.roomInfo[i].userId === target_id)
					{
						this.chat.joined_room[room_id].roomInfo.splice(i, 1);
					}
				}
			}
		}
	}

	updateRoomActionPromote(target_id: number, room_id: number)
	{
		const room = this.chat.joined_room[room_id];
		if (room && room.roomInfo)
			for (var i = 0; i < room.roomInfo.length; i++)
				if (room.roomInfo[i].userId === target_id)
					this.chat.joined_room[room_id].roomInfo[i].isAdmin = true;
	}

	updateRoomActionGiveKrown(target_id: number, user_id: number, room_id: number)
	{
		const room = this.chat.joined_room[room_id];
		if (room && room.roomInfo)
		{
			for (var i = 0; i < room.roomInfo.length; i++)
			{
				if (room.roomInfo[i].userId === target_id)
					this.chat.joined_room[room_id].roomInfo[i].isOwner = true;
				if (room.roomInfo[i].userId === user_id)
					this.chat.joined_room[room_id].roomInfo[i].isOwner = false;
			}
		}
	}

	updateRoomAction(data: any)
	{
		switch (data.action) {
			case RoomAction.KICK: { this.updateRoomActionKick(
				data.target_id,
				data.room_id,
			); break; }
			case RoomAction.PROMOTE: { this.updateRoomActionPromote(
				data.target_id,
				data.room_id,
			); break; }
			case RoomAction.OWNERSHIP: { this.updateRoomActionGiveKrown(
				data.target_id,
				data.user_id,
				data.room_id,
			); break; }
		}
	}

	updateSelectedRoom(room: ChatRoomI)
	{
		this.chat.selected_room_id = room.id.toString();
		this.chat.selected_room = room;
	}

	getCurrentMessage(i: number)
	{ return (this.chatRoomService.getCurrentMessage(this.getSelectedRoom(), i)); }

	getCurrentMessageUser(i: number)
	{ return (this.chatRoomService.getCurrentMessageUser(this.getSelectedRoom(), i)); }

	getRoomTitle()
	{ return (this.chatRoomService.getRoomTitle(this.getSelectedRoom())); }

	getAvailableChannelRoom()
	{
		var room_list: ChatRoomI[] = [];

		for (var room_id in this.chat.available_room)
			room_list.push(this.chat.available_room[room_id]);
		return (room_list);
	}

	getJoinedChannelRoom()
	{
		var room_list: ChatRoomI[] = [];

		for (var room_id in this.chat.joined_room)
			if (this.chatRoomService.isGoodRoom(this.chat.joined_room[room_id]))
				room_list.push(this.chat.joined_room[room_id]);
		return (room_list);
	}

	getJoinSelected(room_id: string)
	{
		if (room_id === "-1" ||
			this.chat.available_room[room_id].id === -1 ||
			!this.chatRoomService.isGoodRoom(this.chat.available_room[room_id]))
			return (DefChatRoomI);
		return (this.chat.available_room[room_id]);
	}

	getJoinUser(room_id: string): UserI[]
	{ return (this.chatRoomService.getUserInRoom(this.getJoinSelected(room_id)));}

	getSelectedRoom(): ChatRoomI
	{
		if (!this.isGoodSelectedRoom())
			return (DefChatRoomI);
		return this.chat.selected_room;
	}

	getSelectedRoomUser(): UserI[]
	{ return (this.chatRoomService.getUserInRoom(this.getSelectedRoom())); }

	getOwner(): UserI
	{ return (this.chatRoomService.getOwner(this.getSelectedRoom())); }

	getAdmin(): UserI[]
	{ return (this.chatRoomService.getAdmin(this.getSelectedRoom())); }



	isOwnerSelectedRoom(): boolean
	{
		console.log(this.userService);
		return (this.chatRoomService.isOwner(
						this.getSelectedRoom(), this.userService.user.id)); }


	isAdminSelectedRoom(): boolean
	{ return (this.chatRoomService.isAdmin(
						this.getSelectedRoom(), this.userService.user.id)); }

	isGoodSelectedRoom(): boolean
	{
		if (this.chat.selected_room_id === "-1" ||
			this.chat.available_room[this.chat.selected_room_id] &&
			!this.chatRoomService.isGoodRoom(
						this.chat.available_room[this.chat.selected_room_id]))
			return (false);
		return (true);
	}

	isSameUser(i: number)
	{ return (this.chatRoomService.isSameUser(this.getSelectedRoom(), i)); }

	sendMessage(message: string) {
		const selected_room = this.getSelectedRoom();

		if (selected_room.id === -1) return ;
		this.wsGateway.sendGlobalMessage(selected_room.id, message);
	}

	getInfo()
	{
		const	selected_room = this.getSelectedRoom();

		// console.clear();

		console.log(this.chat);

		if (selected_room.id === -1)
			console.log("[onGetInfo] selected_room not found");
		else
			console.log("[onGetInfo] selected_room", selected_room);

		console.log("[onGetinfo] available_room", this.chat.available_room);
		console.log("[onGetinfo] joined_room", this.chat.joined_room);

		// if (selected_room.id === -1)
		// 	console.log("[onGetInfo] selected_room not found");
		// else
		// 	console.log("[onGetInfo] selected_room", selected_room);
	}
}

