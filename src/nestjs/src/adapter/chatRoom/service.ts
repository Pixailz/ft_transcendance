import { Injectable } from "@nestjs/common";
import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";

@Injectable()
export class ChatRoomService {
	constructor (
		private dbUserChatRoomService: DBUserChatRoomService,
	) { }

	async getAllRoomId(user_id: number): Promise<number[]>
	{
		let room_ids = [];

		const user_chat_rooms = await this.dbUserChatRoomService.getAllChatFromUser(user_id);
		for(const val of user_chat_rooms) {
			room_ids.push(val.roomId);
		}
		return (room_ids);
	}
}
