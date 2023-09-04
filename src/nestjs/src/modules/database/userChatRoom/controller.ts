import {
	Body,
	Controller,
	Post,
	Put,
	Get,
	Delete,
	Param,
	Request,
} from "@nestjs/common";

import { DBUserChatRoomService } from "./service";
import { DBUserChatRoomPost } from "./dto";

@Controller("db/user_chat_room")
export class DBUserChatRoomController {
	constructor(private readonly dbChatRoomService: DBUserChatRoomService) {}

	@Post(":chat_id")
	create(
		@Request() req,
		@Param("chat_id") chatId: number,
		@Body() post: DBUserChatRoomPost,
	) {
		const userId = req.user.user_id;
		return this.dbChatRoomService.create(post, userId, chatId);
	}

	@Get()
	async getAll() {
		return await this.dbChatRoomService.returnAll();
	}

	@Get(":chat_id")
	async getOne(@Request() req, @Param("chat_id") chatId: number) {
		const userId = req.user.user_id;
		return await this.dbChatRoomService.returnOne(userId, chatId);
	}

	@Put(":chat_id")
	async update(
		@Request() req,
		@Param("chat_id") chatId: number,
		@Body() userPost: DBUserChatRoomPost,
	) {
		const userId = req.user.user_id;
		return await this.dbChatRoomService.update(userId, chatId, userPost);
	}

	@Delete(":chat_id")
	async delete(@Request() req, @Param("chat_id") chatId: number) {
		const userId = req.user.user_id;
		return await this.dbChatRoomService.delete(userId, chatId);
	}
}
