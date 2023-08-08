import { Injectable } from "@nestjs/common";
import { DBUserChatRoomService } from "../../modules/database/userChatRoom/service";
import {DBChatRoomService} from "../../modules/database/chatRoom/service"



@Injectable()
export class ChatRoomService {
	constructor (
		private dbUserChatRoomService: DBUserChatRoomService,
		private dbChatRoomService: DBChatRoomService,
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

	async createPrivateRoom(source: number, dest: number)
	{
		const room_id = await this.dbChatRoomService.create({name: "private"});
		await this.dbUserChatRoomService.create({isOwner: true, isAdmin: true}, source, room_id);
		await this.dbUserChatRoomService.create({isOwner: true, isAdmin: true}, dest, room_id);
		return (room_id);
	}
}
