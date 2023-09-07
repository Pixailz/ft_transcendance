import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";
import { DBChatRoomService } from "../../modules/database/chatRoom/service";
import { DBMessageService } from "src/modules/database/message/service";
import { MessageEntity } from "src/modules/database/message/entity";
import { ChatRoomEntity, RoomType } from "src/modules/database/chatRoom/entity";

@Injectable()
export class ChatRoomService {
	constructor(
		private dbUserChatRoomService: DBUserChatRoomService,
		private dbChatRoomService: DBChatRoomService,
		private dbMessageService: DBMessageService,
	) {}

	async getAllPrivateRoom(user_id: number): Promise<ChatRoomEntity[]> {
		return await this.dbUserChatRoomService.getAllPrivateRoom(user_id);
	}

	async getPrivateRoomFromRoomId(room_id: number): Promise<ChatRoomEntity> {
		return await this.dbChatRoomService.getAllPrivateRoom(room_id);
	}

	async getPrivateRoomWithUser(
		user_id: number,
		dst_id: number,
	): Promise<ChatRoomEntity> {
		const all_chat_room =
			await this.dbUserChatRoomService.getAllPrivateRoom(user_id);

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

	async createPrivateRoom(source: number, dest: number) {
		const room_id = await this.dbChatRoomService.create({
			name: "private",
		});
		await this.dbChatRoomService.updateType(room_id, {
			type: RoomType.PRIVATE,
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

	async getAllPrivateMessageRoom(room_id: number): Promise<MessageEntity[]> {
		const user_room =
			await this.dbUserChatRoomService.getAllPrivateUserRoom(room_id);

		return user_room[0].room.message;
	}

	async getAllGlobalMessageRoom(room_id: number): Promise<MessageEntity[]> {
		const user_room = await this.dbUserChatRoomService.getAllGlobalUserRoom(
			room_id,
		);
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
	async createGlobalRoom(user_id: number, name: string, password: string) {
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

	async createGlobalRoomAddUser(
		user_id: number,
		name: string,
		password: string,
		user_ids: number[],
	) {
		const room_id = await this.createGlobalRoom(user_id, name, password);
		for (let id of user_ids) {
			await this.dbUserChatRoomService.create(
				{ isOwner: false, isAdmin: false },
				id,
				room_id,
			);
		}
		return room_id;
	}

	async joinGlobalRoom(room_id: number, user_id: number) {
		await this.dbUserChatRoomService.create(
			{ isOwner: false, isAdmin: false },
			user_id,
			room_id,
		);
	}

	async getAllAvailableGlobalRoom(): Promise<ChatRoomEntity[]> {
		const all_chat_room =
			await this.dbUserChatRoomService.getAllAvailableGlobalRoom();
		return all_chat_room;
	}

	async getAllJoinedGlobalRoom(user_id: number): Promise<ChatRoomEntity[]> {
		const all_chat_room =
			await this.dbUserChatRoomService.getAllJoinedGlobalRoom(user_id);
		all_chat_room.forEach((ii, i) => {
			all_chat_room[i].message.forEach((jj, j) => {
				delete all_chat_room[i].message[i].user.nonce;
				delete all_chat_room[i].message[i].user.twoAuthFactor;
				delete all_chat_room[i].message[i].user.twoAuthFactorSecret;
			})
		})
		return all_chat_room;
	}

	async getAvailableGlobalRoom(room_id: number): Promise<ChatRoomEntity> {
		const chat_room =
			await this.dbUserChatRoomService.getAvailableGlobalRoom(room_id);
		return chat_room;
	}

	async getJoinedGlobalRoom(room_id: number): Promise<ChatRoomEntity> {
		const chat_room = await this.dbUserChatRoomService.getJoinedGlobalRoom(
			room_id,
		);
		chat_room.message.forEach((ii, i) => {
			delete chat_room.message[i].user.nonce;
			delete chat_room.message[i].user.twoAuthFactor;
			delete chat_room.message[i].user.twoAuthFactorSecret;
		})
		return chat_room;
	}

	async sendMessage(dest_id: number, from_id: number, message: string) {
		await this.dbMessageService.create(
			{ content: message },
			from_id,
			dest_id,
		);
	}

	async getAllUserFromRoom(room_id: number): Promise<number[]> {
		return await this.dbUserChatRoomService.returnAllUserFromRoom(room_id);
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
			isAdmin: true,
		});
		await this.dbUserChatRoomService.update(user_id, room_id, {
			isAdmin: false,
		});
	}
}
