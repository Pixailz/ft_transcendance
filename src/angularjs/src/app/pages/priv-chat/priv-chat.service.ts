import { Injectable } from "@angular/core";
import {
	ChatRoomI,
	DefChatRoomI,
	DefFriendI,
	FriendI,
	UserI
} from "src/app/interfaces/chat.interface";
import { DefChatPrivI } from "./priv-chat.interface";
import { UserService } from "../../services/user.service";

@Injectable({
	providedIn: "root",
})
export class PrivChatService {
	constructor(
		private userService: UserService,
	) {}

	chat = DefChatPrivI;

	updateAllFriend(friends: UserI[])
	{
		var founded: boolean;

		if (friends.length === 0)
		{
			this.chat.friends = [ DefFriendI ]
			return ;
		}
		for (var i = 0; i < friends.length; i++)
		{
			founded = false;
			for (const user_id in this.chat.friends)
			{
				if (friends[i].id === Number(user_id))
				{
					this.chat.friends[user_id].user_info = friends[i];
					founded = true;
					continue ;
				}
			}
			if (!founded)
				this.chat.friends[friends[i].id.toString()] = {
					user_info: friends[i],
					room:	DefChatRoomI,
				}
		}
	}

	updateAllPrivateRoom(chatroom: ChatRoomI[])
	{
		for (var i = 0; i < chatroom.length; i++)
		{
			for (const friend_id in this.chat.friends)
			{
				const	array_chat_room = chatroom[i].roomInfo;
				if (!array_chat_room || !array_chat_room[0])
					return ;
				if (Number(friend_id) === array_chat_room[0].user.id)
				{
					this.chat.friends[friend_id].room = chatroom[i];
					this.chat.friends[friend_id].room.id = chatroom[i].id;
					this.chat.friends[friend_id].room.name = chatroom[i].name;
					this.chat.friends[friend_id].room.type = chatroom[i].type;
					this.chat.friends[friend_id].room.password = chatroom[i].password;
					this.chat.friends[friend_id].room.roomInfo = chatroom[i].roomInfo;
				}
			}
		}
	}

	updateAllPrivateMessage(data: any)
	{
		for (const chat_id in data)
		{
			for (const friend_id in this.chat.friends)
			{
				if (this.chat.friends[friend_id].room.id == chat_id)
				{
					this.chat.friends[friend_id].room.message = data[chat_id];
					if (this.chat.friends[friend_id].user_info.id === Number(this.chat.selected_friend_id))
						this.chat.selected_friend.room.message = data[chat_id]
					break ;
				}
			}
		}
	}

	updateNewPrivateRoom(chatroom: ChatRoomI)
	{
		if (!chatroom.roomInfo)
			return ;
		for (const friend_id in this.chat.friends)
			if (this.chat.friends[friend_id].user_info.id === chatroom.roomInfo[0].userId)
				this.chat.friends[friend_id].room = chatroom;
	}

	updateNewPrivateMessage(data: any)
	{
		for (const friend_id in this.chat.friends)
		{
			if (this.chat.friends[friend_id].room.id == data.room_id)
			{
				this.chat.friends[friend_id].room.message = data.messages;
				if (this.chat.friends[friend_id].user_info.id === Number(this.chat.selected_friend_id))
					this.chat.selected_friend.room.message = data.messages
				break ;
			}
		}
	}

	updateNewFriendStatus(friends_status: any) {
		// TODO: readd correct check when friends is implemented with his listener
		if (!this.chat.friends[friends_status.user_id])
			return ;
			// this.chat.friends[friends_status.user_id] = DefFriendI;
		if (!this.chat.friends[friends_status.user_id].user_info)
			return ;
			// this.chat.friends[friends_status.user_id].user_info = DefUserI;
		this.chat.friends[friends_status.user_id].user_info.status = friends_status.status;
	}

	updateSelectedFriend(friend: FriendI)
	{
		this.chat.selected_friend_id = friend.user_info.id.toString();
		this.chat.selected_friend = friend;
	}

	async updateUserInfo()
	{
		this.chat.user = await this.userService.getUserInfo();
	}

	getInfo()
	{
		const	selected_friend = this.getSelectedFriend();
		const	selected_room = this.getSelectedFriendRoom();

		// console.clear();

		console.log(this.chat);

		if (selected_friend.user_info.id === -1)
			console.log("[onGetInfo] selected_friend not found");
		else
			console.log("[onGetInfo] selected_friend", selected_friend);

		if (selected_room.id === -1)
			console.log("[onGetInfo] selected_room not found");
		else
			console.log("[onGetInfo] selected_room", selected_room);
	}

	getFriends()
	{
		var friend_list: FriendI[] = [];

		for (var friend_id in this.chat.friends)
			if (this.chat.friends[friend_id].room.id === -1)
				friend_list.push(this.chat.friends[friend_id]);
		return (friend_list);
	}

	getPrivateRoom()
	{
		var friend_list: FriendI[] = [];

		for (var friend_id in this.chat.friends)
			if (this.chat.friends[friend_id].room.id !== -1)
				friend_list.push(this.chat.friends[friend_id]);
		return (friend_list);
	}

	getCurrentUser()
	{
		return (this.chat.user);
	}

	getCurrentMessage(i: number)
	{
		return (
			this.chat.selected_friend.room.message[
				this.chat.selected_friend.room.message.length - i - 1
			]
		);
	}

	getCurrentMessageUser(i: number)
	{
		const current_message = this.getCurrentMessage(i);
		return(this.chat.friends[current_message.userId].user_info.ftLogin);
	}

	getSelectedFriendRoom(): ChatRoomI
	{
		const selected_friend = this.getSelectedFriend();

		if (!this.isGoodSelectedFriendRoom())
			return DefChatRoomI;
		return selected_friend.room;
	}

	isGoodSelectedFriendRoom(): boolean
	{
		const selected_friend = this.getSelectedFriend();

		if (selected_friend.user_info.id === -1)
			return (false);
		if (!this.isGoodFriendRoom(selected_friend.room))
			return (false);
		return (true);
	}

	isGoodFriendRoom(room: ChatRoomI): boolean
	{
		if (room.id === -1)
			return false
		return true;
	}

	getSelectedFriend(): FriendI
	{
		if (!this.isGoodSelectedFriend())
			return DefFriendI;
		return this.chat.selected_friend;
	}

	isGoodSelectedFriend(): boolean
	{
		if (this.chat.selected_friend_id === "-1" ||
			this.chat.friends[this.chat.selected_friend_id] &&
			!this.isGoodFriend(this.chat.friends[this.chat.selected_friend_id]))
			return (false);
		return (true);
	}

	isGoodFriend(friend: FriendI): boolean
	{
		if (friend.user_info.id === -1)
			return false
		return true;
	}
}
