import {
	Body,
	Controller,
	Post,
	Put,
	Get,
	Delete,
	Res,
	Param,
	Req,
} from "@nestjs/common";
import { Response } from "express";

import { DBUserChatRoomService } from "./service";
import { DBUserChatRoomPost } from "./dto";

@Controller("db/user_chat_room")
export class DBUserChatRoomController {
	constructor(private readonly dbChatRoomService: DBUserChatRoomService) {}

	@Post(":user_id/:chat_id")
	create(
		@Param("user_id") userId: number,
		@Param("chat_id") chatId: number,
		@Body() post: DBUserChatRoomPost,
	) {
		return this.dbChatRoomService.create(post, userId, chatId);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbChatRoomService.returnAll());
	}

	@Get(":user_id/:chat_id")
	async getOne(
		@Param("user_id") userId: number,
		@Param("chat_id") chatId: number,
		@Res() res: Response,
	) {
		res.send(await this.dbChatRoomService.returnOne(userId, chatId));
	}

	@Put(":user_id/:chat_id")
	async update(
		@Param("user_id") userId: number,
		@Param("chat_id") chatId: number,
		@Body() userPost: DBUserChatRoomPost,
		@Res() res: Response,
	) {
		res.send(await this.dbChatRoomService.update(userId, chatId, userPost));
	}

	@Delete(":user_id/:chat_id")
	async delete(
		@Param("user_id") userId: number,
		@Param("chat_id") chatId: number,
		@Res() res: Response,
	) {
		res.send(await this.dbChatRoomService.delete(userId, chatId));
	}
}
