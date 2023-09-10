import { Injectable } from "@nestjs/common";
import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";
import { DBChatRoomService } from "../../modules/database/chatRoom/service";
import { UserChatRoomEntity } from "src/modules/database/userChatRoom/entity";
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
		await this.dbChatRoomService.updateType(room_id, {type: RoomType.PRIVATE});
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

	async sendMessage(dest_id: number, from_id: number, message: string) {
		await this.dbMessageService.create(
			{ content: message },
			from_id,
			dest_id,
		);
	}

	async getAllMessageRoom(room_id: number): Promise<MessageEntity[]> {
		const room = await this.dbUserChatRoomService.getAllPrivateUserRoom(
			room_id,
		);
		return room[0].room.message;
	}

	async getAllUserFromRoom(room_id: number): Promise<number[]> {
		return await this.dbUserChatRoomService.returnAllUserFromRoom(room_id);
	}
}
