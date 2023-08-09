import { Injectable } from "@nestjs/common";
import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";
import { DBChatRoomService } from "../../modules/database/chatRoom/service";
import { UserChatRoomEntity } from "src/modules/database/userChatRoom/entity";
import { DBMessageService } from "src/modules/database/message/service";
import { MessageEntity } from "src/modules/database/message/entity";
import { DBMessagePost } from "src/modules/database/message/dto";
import { ChatRoomEntity } from "src/modules/database/chatRoom/entity";

@Injectable()
export class ChatRoomService {
	constructor(
		private dbUserChatRoomService: DBUserChatRoomService,
		private dbChatRoomService: DBChatRoomService,
		private dbMessageService: DBMessageService,
	) {}

	async getAllRoomId(user_id: number): Promise<number[]> {
		let room_ids = [];

		const user_chat_rooms =
			await this.dbUserChatRoomService.getAllRoomFromUser(user_id);
		for (const val of user_chat_rooms) {
			room_ids.push(val.roomId);
		}
		return room_ids;
	}

	async getAllRoom(user_id: number): Promise<UserChatRoomEntity[]> {
		return await this.dbUserChatRoomService.getAllRoomFromUser(user_id);
	}

	async createPrivateRoom(source: number, dest: number) {
		const room_id = await this.dbChatRoomService.create({
			name: "private",
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

	async sendMessage(dest_id: number, from_id: number, message: string) {
		await this.dbMessageService.create(
			{ content: message },
			from_id,
			dest_id,
		);
	}

	async getAllMessageRoom(room_id: number): Promise<MessageEntity[]> {
		const room = await this.dbUserChatRoomService.getAllMessageFromRoom(
			room_id,
		);
		return await room[0].room.message;
	}
	async getAllUserFromRoom(room_id: number): Promise<number[]> {
		return await this.dbUserChatRoomService.returnAllUserFromRoom(room_id);
	}
}
