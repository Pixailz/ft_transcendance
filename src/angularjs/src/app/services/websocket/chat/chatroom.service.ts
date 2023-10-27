import { Injectable } from "@angular/core";
import { DefUserI, UserI } from "src/app/interfaces/user/user.interface";
import { UserService } from "../../user.service";
import { ChatRoomI, RoomType } from "src/app/interfaces/chat/chat-room.interface";
import { MessageI } from "src/app/interfaces/chat/message.inteface";
import { UserChatRoomI } from "src/app/interfaces/chat/user-chat-room.interface";

@Injectable({
	providedIn: "root",
})
export class ChatRoomService {
	constructor(
		private userService: UserService,
	) {}

	getAdmin(room: ChatRoomI): UserI[]
	{
		const user_list: UserI[] = [];

		if (room.id === -1 || !room.roomInfo) return [];
		for (let i = 0; i < room.roomInfo.length; i++)
			if (room.roomInfo[i].isAdmin)
				user_list.push(room.roomInfo[i].user);
		return (user_list);
	}

	getOwner(room: ChatRoomI): UserI
	{
		if (room.id === -1 || !room.roomInfo) return DefUserI;
		for (let i = 0; i < room.roomInfo.length; i++)
			if (room.roomInfo[i].isOwner)
				return (room.roomInfo[i].user);
		return DefUserI;
	}

	getCurrentMessage(room: ChatRoomI, i: number)
	{ return (room.message[room.message.length - i - 1]); }

	getCurrentMessageUser(room: ChatRoomI, i: number)
	{ return (this.getCurrentMessage(room, i).user); }

	getUserInRoom(room: ChatRoomI): UserI[]
	{
		var user_list: UserI[] = [];

		if (!this.isGoodRoomInfo(room)) return [];
		for (var i = 0; i < room.roomInfo.length; i++)
			user_list.push(room.roomInfo[i].user);
		return (user_list);
	}

	getRoomTypeStr(room: ChatRoomI)
	{
		switch (room.type) {
			case RoomType.PUBLIC: { return ("PUBLIC"); }
			case RoomType.PROTECTED: { return ("PROTECTED"); }
			case RoomType.PRIVATE: { return ("PRIVATE"); }
		}
		return ("UNKNOWN");
	}

	getRoomTypeIcon(room: ChatRoomI)
	{
		switch (room.type) {
			case RoomType.PUBLIC: { return ("📢"); }
			case RoomType.PROTECTED: { return ("🔒"); }
			case RoomType.PRIVATE: { return ("🕵️"); }
		}
		return ("❓");
	}

	getRoomTitle(room: ChatRoomI)
	{ return (this.getRoomTypeIcon(room) + "| " + room.name); }

	isGoodFullRoom(room: ChatRoomI): boolean
	{
		if (!this.isGoodRoomInfo(room) ||
			!this.isGoodRoomMessage(room))
			return (false)
		return (true);
	}

	isGoodRoomInfo(room: ChatRoomI): boolean
	{
		if (!this.isGoodRoom(room) || !room.roomInfo) return (false);
		for (var i = 0; i < room.roomInfo.length; i++)
			if (!this.isGoodUserRoom(room.roomInfo[i])) return (false);
		return (true);
	}

	isGoodRoomMessage(room: ChatRoomI): boolean
	{
		if (!this.isGoodRoom(room)) return (false);
		for (var i = 0; i < room.message.length; i++)
			if (!this.isGoodMessage(room.message[i])) return (false);
		return (true);
	}

	isGoodUserRoom(user_room: UserChatRoomI): boolean
	{ return (user_room.roomId !== -1 && this.userService.isGoodUser(user_room.user)); }

	isGoodRoom(room: ChatRoomI): boolean
	{ return (room && room.id !== -1); }

	isGoodMessage(message: MessageI): boolean
	{
		if (message.id === -1 || message.userId === -1 ||
			!this.userService.isGoodUser(message.user))
			return (false);
		return (true);
	}

	isAdmin(room: ChatRoomI, user_id: number): boolean
	{
		const	admin = this.getAdmin(room);

		if (this.isOwner(room, user_id))
			return (true);
		if (!admin.length || admin.length === 0) return false;
		for (var i = 0; i < admin.length; i++)
			if (admin[i].id === user_id)
				return (true)
		return (false);
	}

	isMuted(room: ChatRoomI, user_id: number): boolean
	{
		const date = new Date();
		if (room.id === -1 || !room.roomInfo) return false;
		for (let i = 0; i < room.roomInfo.length; i++)
		{
			const demuteDate = new Date(room.roomInfo[i].demuteDate);
			if (room.roomInfo[i].userId === user_id &&
				room.roomInfo[i].isMuted && date <= demuteDate)
				return (true);
		}
		return (false);
	}

	isOwner(room: ChatRoomI, user_id: number): boolean
	{
		const	owner = this.getOwner(room);

		if (owner.id === -1) return false;
		if (owner.id === user_id) return (true); return (false);
	}

	isBanned(room: ChatRoomI, user_id: number): boolean
	{
		if (!room.roomInfo.length) return false;
		for (var i = 0; i < room.roomInfo.length; i++)
			if (room.roomInfo[i].userId === user_id)
				return (room.roomInfo[i].isBanned)
		return (false);
	}

	isSameUser(room: ChatRoomI, i: number): boolean {
		if (this.isGoodRoomMessage(room)) return false;

		const message_len = room.message.length;

		if (!room.message[message_len - i - 2] ||
			room.message[message_len - i - 2].id === -1 ||
			room.message[message_len - i - 2].id === -1)
			return (false);
		if (room.message[message_len - i - 2].userId !== room.message[message_len - i - 1].userId)
			return (false);
		return (true);
	}
}

