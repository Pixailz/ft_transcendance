import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";
import { DBChatRoomService } from "../../modules/database/chatRoom/service";
import { DBMessageService } from "src/modules/database/message/service";
import { MessageEntity } from "src/modules/database/message/entity";
import { ChatRoomEntity, RoomType } from "src/modules/database/chatRoom/entity";
import { Server } from "socket.io";
import { DBUserService } from "src/modules/database/user/service";
import { WSSocket } from "src/websocket/socket.service";
import { UserService } from "../user/service";
import { Sanitize } from "../../sanitize-object";

@Injectable()
export class ChatRoomService {
	constructor(
		private sanitize: Sanitize,
		private dbUserChatRoomService: DBUserChatRoomService,
		private dbChatRoomService: DBChatRoomService,
		private dbMessageService: DBMessageService,
		private dbUserService: DBUserService,
		private userService: UserService,
		private wsSocket: WSSocket,
	) {}

	async setStatus(server: Server, user_id: number, status: number) {
		await this.dbUserService.setStatus(user_id, status);
		const friends = await this.userService.getAllFriend(user_id);
		this.wsSocket.sendToUsersInfo(
			server,
			friends,
			"getNewStatusFriend",
			{
				user_id: user_id,
				status: status,
			},
		);
	}

	async getAllDmRoom(user_id: number): Promise<ChatRoomEntity[]> {
		return await this.dbChatRoomService.getAllDmRoom(user_id);
	}

	async getDmRoom(room_id: number): Promise<ChatRoomEntity> {
		return await this.dbChatRoomService.getDmRoom(room_id);
	}

	async getDmRoomWithUser(
		user_id: number,
		dst_id: number,
	): Promise<ChatRoomEntity> {
		const all_chat_room =
			await this.dbChatRoomService.getAllDmRoom(user_id);

		for (var i = 0; i < all_chat_room.length; i++) {
			const friends_id = await this.getAllUserFromRoom(
				all_chat_room[i].id,
			);
			if (friends_id.length === 0) continue;
			while (friends_id.indexOf(user_id) !== -1)
				friends_id.splice(friends_id.indexOf(user_id), 1);
			if (friends_id.length) {
				return Promise.resolve(all_chat_room[i]);
			}
		}
		return Promise.reject({
			status: `no chat room between ${user_id} and ${dst_id}`,
		});
	}

	async createDmRoom(source: number, dest: number) {
		const room_id = await this.dbChatRoomService.create({
			name: "DirectMessage",
		});
		await this.dbChatRoomService.updateType(room_id, {
			type: RoomType.DIRECT_MSG,
		});
		await this.dbUserChatRoomService.create(
			{ isOwner: true, isAdmin: true },
			source,
			room_id,
		);
		await this.dbUserChatRoomService.create(
			{ isOwner: true, isAdmin: true },
			dest,
			room_id,
		);
		return room_id;
	}

	async getAllDmMessageRoom(room_id: number): Promise<MessageEntity[]> {
		const user_room =
			await this.dbUserChatRoomService.getUserRoom(room_id);

		return user_room[0].room.message;
	}

	async getAllGlobalMessageRoom(room_id: number): Promise<MessageEntity[]> {
		const user_room = await this.dbUserChatRoomService.getUserRoom(room_id);
		return user_room[0].room.message;
	}

	async getUserChatRoom(user_id: number, room_id: number)
	{
		return (this.dbUserChatRoomService.returnOneWithUser(user_id, room_id))
	}

	async hashPass(password: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(password, salt);
	}
	async createChannelRoom(user_id: number, name: string, password: string) {
		var room_id: number = -1;
		if (password.length !== 0) {
			const hashed_pass = await this.hashPass(password);
			room_id = await this.dbChatRoomService.create({
				name: name,
				password: hashed_pass,
			});
			await this.dbChatRoomService.updateType(room_id, {
				type: RoomType.PROTECTED,
			});
		} else {
			room_id = await this.dbChatRoomService.create({
				name: name,
				password: "",
			});
			await this.dbChatRoomService.updateType(room_id, {
				type: RoomType.PUBLIC,
			});
		}
		await this.dbUserChatRoomService.create(
			{ isOwner: true, isAdmin: true },
			user_id,
			room_id,
		);
		return room_id;
	}

	async createChannelRoomAddUser(
		user_id: number,
		name: string,
		password: string,
		user_ids: number[],
	) {
		const room_id = await this.createChannelRoom(user_id, name, password);
		for (let id of user_ids) {
			await this.dbUserChatRoomService.create(
				{ isOwner: false, isAdmin: false },
				id,
				room_id,
			);
		}
		return room_id;
	}

	async joinChannelRoom(room_id: number, user_id: number) {
		await this.dbUserChatRoomService.create(
			{ isOwner: false, isAdmin: false },
			user_id,
			room_id,
		);
	}

	async getAllAvailableChannelRoom(): Promise<ChatRoomEntity[]> {
		const all_chat_room =
			await this.dbChatRoomService.getAllAvailableChannelRoom();
		return all_chat_room;
	}

	async getAllJoinedChannelRoom(user_id: number): Promise<ChatRoomEntity[]> {
		const all_chat_room =
			await this.dbChatRoomService.getAllJoinedChannelRoom(user_id);
		return (this.sanitize.ChatRooms(all_chat_room));
	}

	async getAvailableChannelRoom(room_id: number): Promise<ChatRoomEntity> {
		const chat_room =
			await this.dbChatRoomService.getAvailableChannelRoom(room_id);
		return chat_room;
	}

	async getJoinedChannelRoom(room_id: number): Promise<ChatRoomEntity> {
		const chat_room = await this.dbChatRoomService.getJoinedChannelRoom(
			room_id,
		);
		return (this.sanitize.ChatRoom(chat_room));
	}

	async sendMessage(dest_id: number, from_id: number, message: string): Promise<number> {
		return (await this.dbMessageService.create(
			{ content: message },
			from_id,
			dest_id,
		));
	}

	async getAllUserFromRoom(room_id: number): Promise<number[]> {
		const all_user_chat_room = await this.dbUserChatRoomService.getUserRoom(room_id);
		var user_list: number[] = [];
		all_user_chat_room.forEach((i) => {
			user_list.push(i.userId);
		})
		return user_list;
	}

	async changeRoomDetails(room_id: number, details: any) {
		await this.dbChatRoomService.update(room_id, details);
	}

	async updateType(room_id: number, type: RoomType)
	{
		await this.dbChatRoomService.updateType(room_id, {
			type: type,
		});
	}

	async kickUser(room_id: number, target_id: number)
	{
		await this.dbUserChatRoomService.delete(target_id, room_id);
	}

	async promoteUser(room_id: number, target_id: number)
	{
		await this.dbUserChatRoomService.update(target_id, room_id, {
			isAdmin: true,
		});
	}

	async giveKrownUser(user_id: number, room_id: number, target_id: number)
	{
		await this.dbUserChatRoomService.update(target_id, room_id, {
			isOwner: true,
		});
		await this.dbUserChatRoomService.update(user_id, room_id, {
			isOwner: false,
		});
	}

	async getMessage(message_id: number)
	{ return (await this.dbMessageService.getMessage(message_id)); }
}
