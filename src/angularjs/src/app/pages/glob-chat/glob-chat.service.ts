import { Injectable } from "@angular/core";
import { DefChatGlobI, RoomAction } from "./glob-chat.interface";
import { UserService } from "../../services/user.service";
import { BackService } from "../../services/back.service";
import { ChatRoomI, DefChatRoomI, DefUserChatRoomI, DefUserI, RoomType, UserChatRoomI, UserI } from "../../interfaces/chat.interface";

@Injectable({
	providedIn: "root",
})
export class GlobChatService {
	constructor(
		private userService: UserService,
		private back: BackService,
	) {}

	chat = DefChatGlobI;

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

	async updateUserInfo()
	{
		this.chat.user = await this.userService.getUserInfo();
	}

	updateAllAvailableGlobalRoom(chatroom: ChatRoomI[])
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

	updateAllJoinedGlobalRoom(chatroom: ChatRoomI[])
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

	updateNewAvailableGlobalRoom(chatroom: ChatRoomI)
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

	updateNewJoinedGlobalRoom(chatroom: ChatRoomI)
	{
		var founded: boolean;

		founded = false;
		for (const room_id in this.chat.joined_room)
		{
			if (chatroom.id === Number(room_id))
			{
				this.chat.joined_room[room_id] = chatroom;
				founded = true;
				continue ;
			}
		}
		if (!founded)
			this.chat.joined_room[chatroom.id.toString()] = chatroom
		if (this.chat.available_room[chatroom.id])
			delete this.chat.available_room[chatroom.id];
	}

	updateNewGlobalMessage(data: any)
	{
		this.chat.joined_room[data.room_id].message = data.messages;
	}

	updateNewUserJoinGlobalRoom(user_chatroom: UserChatRoomI)
	{
		this.chat.joined_room[user_chatroom.roomId].roomInfo.push(user_chatroom);
	}

	updateNewDetailsGlobalRoom(chatroom: ChatRoomI)
	{
		var target = this.chat.joined_room[chatroom.id];
		console.log("chatroom", chatroom);
		if (this.chat.joined_room[chatroom.id])
		{
			if (target.name !== chatroom.name) target.name = chatroom.name;
			if (target.type !== chatroom.type) target.type = chatroom.type;
		}
	}

	updateRoomActionKick(target_id: number, room_id: number)
	{
		if (target_id === this.chat.user.id)
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

	updateRoomAction(data: any)
	{
		switch (data.action) {
			case RoomAction.KICK: { this.updateRoomActionKick(
				data.target_id,
				data.room_id
			); break; }
		}
	}

	updateSelectedRoom(room: ChatRoomI)
	{
		this.chat.selected_room_id = room.id.toString();
		this.chat.selected_room = room;
	}

	getRoomTitle(room: ChatRoomI)
	{
		let	info = "";

		switch (room.type) {
			case RoomType.PUBLIC: { info += "📢"; break; }
			case RoomType.PROTECTED: { info += "🔒"; break; }
		}
		info += "| " + room.name;
		return (info);
	}

	getRoomTypeStr(room: ChatRoomI)
	{
		let	info = "";

		switch (room.type) {
			case RoomType.PUBLIC: { info += "PUBLIC"; break; }
			case RoomType.PROTECTED: { info += "PROTECTED"; break; }
		}
		return (info);
	}

	getAvailableGlobalRoom()
	{
		var room_list: ChatRoomI[] = [];

		for (var room_id in this.chat.available_room)
		{
			if (this.chat.available_room[room_id].id !== -1)
				room_list.push(this.chat.available_room[room_id]);
		}
		return (room_list);
	}

	getJoinedGlobalRoom()
	{
		var room_list: ChatRoomI[] = [];

		for (var room_id in this.chat.joined_room)
		{
			if (this.chat.joined_room[room_id].id !== -1)
				room_list.push(this.chat.joined_room[room_id]);
		}
		return (room_list);
	}

	getJoinSelected(room_id: string)
	{
		if (room_id === "-1" ||
			this.chat.available_room[room_id].id === -1 ||
			!this.isGoodRoom(this.chat.available_room[room_id]))
			return (DefChatRoomI);
		return (this.chat.available_room[room_id]);
	}

	getJoinUser(room_id: string): UserI[]
	{
		const	selected_room = this.getJoinSelected(room_id);
		let		user_list: UserI[] = [];

		if (selected_room.id === -1) return [];
		for (let i = 0; i < selected_room.roomInfo.length; i++)
			user_list.push(selected_room.roomInfo[i].user);

		return (user_list);
	}

	getSelectedRoom(): ChatRoomI
	{
		if (!this.isGoodSelectedRoom())
			return (DefChatRoomI);
		return this.chat.selected_room;
	}

	getSelectedRoomUser(): UserI[]
	{
		const	selected_room = this.getSelectedRoom();
		let		user_list: UserI[] = [];

		if (selected_room.id === -1 || !selected_room.roomInfo) return [];
		for (let i = 0; i < selected_room.roomInfo.length; i++)
			// if (this.chat.user.id !== selected_room.roomInfo[i].user.id)
				user_list.push(selected_room.roomInfo[i].user);
		return (user_list);
	}

	getCurrentMessage(i: number)
	{
		return (
			this.chat.selected_room.message[
				this.chat.selected_room.message.length - i - 1
			]
		);
	}

	getCurrentUser()
	{
		return (this.chat.user);
	}

	getCurrentMessageUser(i: number)
	{
		const current_message = this.getCurrentMessage(i);
		return (current_message.user);
	}

	getOwnerSelectedRoom(): UserI
	{
		return (this.getOwner(this.getSelectedRoom()));
	}

	getAdminSelectedRoom(): UserI[]
	{
		return (this.getAdmin(this.getSelectedRoom()));
	}

	getOwner(room: ChatRoomI): UserI
	{
		if (room.id === -1 || !room.roomInfo) return DefUserI;
		for (let i = 0; i < room.roomInfo.length; i++)
			if (room.roomInfo[i].isOwner)
				return (room.roomInfo[i].user);
		return DefUserI;
	}

	getAdmin(room: ChatRoomI): UserI[]
	{
		const user_list: UserI[] = [];

		if (room.id === -1 || !room.roomInfo) return [];
		for (let i = 0; i < room.roomInfo.length; i++)
			if (room.roomInfo[i].isAdmin)
				user_list.push(room.roomInfo[i].user);
		return (user_list);
	}

	isOwnerSelectedRoom(): boolean
	{
		return (this.isOwner(this.getSelectedRoom()))
	}

	isOwner(room: ChatRoomI): boolean
	{
		if (room.id === -1 || !room.roomInfo) return false;
		for (let i = 0; i < room.roomInfo.length; i++)
			if (this.chat.user.id === room.roomInfo[i].userId &&
				room.roomInfo[i].isOwner === true)
					return (true);
		return (false);
	}

	isAdminSelectedRoom(): boolean
	{
		return (this.isAdmin(this.getSelectedRoom()))
	}

	isAdmin(room: ChatRoomI): boolean
	{
		if (room.id === -1 || !room.roomInfo) return false;
		for (let i = 0; i < room.roomInfo.length; i++)
			if (this.chat.user.id === room.roomInfo[i].userId &&
				room.roomInfo[i].isAdmin === true)
					return (true);
		return (false);
	}

	isGoodSelectedRoom(): boolean
	{
		if (this.chat.selected_room_id === "-1" ||
			this.chat.available_room[this.chat.selected_room_id] &&
			!this.isGoodRoom(this.chat.available_room[this.chat.selected_room_id]))
			return (false);
		return (true);
	}

	isGoodRoom(chatroom: ChatRoomI): boolean
	{
		if (chatroom.id === -1)
			return false
		return true;
	}
}
