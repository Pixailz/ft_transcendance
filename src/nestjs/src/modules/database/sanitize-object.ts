import { ChatRoomEntity } from "./chatRoom/entity";
import { FriendRequestEntity } from "./friendRequest/entity";
import { MessageEntity } from "./message/entity";
import { UserEntity } from "./user/entity";
import { UserChatRoomEntity } from "./userChatRoom/entity";

export class Sanitize {
	toKeepUser = ["id", "ftLogin", "nickname", "email", "status", "lastSeen"];

	toKeepMessage = [
		"id",
		"roomId",
		"userId",
		"user",
		"room",
		"content",
		"updateAt",
	];

	toKeepChatRoom = ["id", "name", "type", "roomInfo", "message"];

	toKeepUserChatRoom = [
		"userId",
		"roomId",
		"user",
		"room",
		"isOwner",
		"isAdmin",
		"isBanned",
		"isMuted",
		"demuteDate",
	];

	object(obj: any, toKeep: string[]): any {
		Object.getOwnPropertyNames(obj).forEach((key) => {
			if (!toKeep.includes(key)) delete obj[key];
		});
		return obj;
	}

	User(user: UserEntity): UserEntity {
		if (user) return this.object(user, this.toKeepUser);
		else return user;
	}

	Users(users: UserEntity[]): UserEntity[] {
		const new_users: UserEntity[] = [];
		if (!users) return [];
		for (let i = 0; i < users.length; i++)
			new_users.push(this.User(users[i]));
		return new_users;
	}

	FriendRequest(req: FriendRequestEntity): FriendRequestEntity {
		if (req)
			return {
				meId: req.meId,
				me: this.User(req.me),
				friendId: req.friendId,
				friend: this.User(req.friend),
			} as FriendRequestEntity;
		else return req;
	}

	FriendRequests(reqs: FriendRequestEntity[]): FriendRequestEntity[] {
		const new_reqs: FriendRequestEntity[] = [];

		if (!reqs) return [];
		for (let i = 0; i < reqs.length; i++)
			new_reqs.push(this.FriendRequest(reqs[i]));
		return new_reqs;
	}

	Message(message: MessageEntity): MessageEntity {
		if (message) {
			const new_message: MessageEntity = this.object(
				message,
				this.toKeepMessage,
			);
			new_message.user = this.User(message.user);
			new_message.room = this.ChatRoom(message.room);
			return new_message;
		} else return message;
	}

	Messages(messages: MessageEntity[]): MessageEntity[] {
		const new_messages: MessageEntity[] = [];

		if (!messages) return [];
		for (let i = 0; i < messages.length; i++)
			new_messages.push(this.Message(messages[i]));
		return new_messages;
	}

	ChatRoom(room: ChatRoomEntity): ChatRoomEntity {
		if (room) {
			const new_room: ChatRoomEntity = this.object(
				room,
				this.toKeepChatRoom,
			);
			new_room.roomInfo = this.UserChatRooms(room.roomInfo);
			new_room.message = this.Messages(room.message);
			return new_room;
		} else return room;
	}

	ChatRooms(rooms: ChatRoomEntity[]): ChatRoomEntity[] {
		const new_rooms: ChatRoomEntity[] = [];
		for (let i = 0; i < rooms.length; i++)
			new_rooms.push(this.ChatRoom(rooms[i]));
		return new_rooms;
	}

	UserChatRoom(user_room: UserChatRoomEntity): UserChatRoomEntity {
		if (user_room) {
			const new_user_room: UserChatRoomEntity = this.object(
				user_room,
				this.toKeepUserChatRoom,
			);
			new_user_room.user = this.User(new_user_room.user);
			new_user_room.room = this.ChatRoom(new_user_room.room);
			return new_user_room;
		} else return user_room;
	}

	UserChatRooms(user_rooms: UserChatRoomEntity[]): UserChatRoomEntity[] {
		const new_user_rooms: UserChatRoomEntity[] = [];

		if (!user_rooms) return [];
		for (let i = 0; i < user_rooms.length; i++)
			new_user_rooms.push(this.UserChatRoom(user_rooms[i]));
		return new_user_rooms;
	}
}
