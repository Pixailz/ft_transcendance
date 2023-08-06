import {
	Body,
	Controller,
	Post,
	Put,
	Get,
	Delete,
	Res,
	Param,
} from "@nestjs/common";
import { Response } from "express";

import { DBChatRoomService } from "./service";
import { DBChatRoomPost } from "./dto";

@Controller("db/chat_room")
export class DBChatRoomController {
	constructor(private readonly dbChatRoomService: DBChatRoomService) {}

	@Post()
	create(@Body() post: DBChatRoomPost) {
		return this.dbChatRoomService.create(post);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbChatRoomService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") userId: number, @Res() res: Response) {
		res.send(await this.dbChatRoomService.returnOne(userId));
	}

	@Put(":id")
	async update(
		@Param("id") userId: number,
		@Body() userPost: DBChatRoomPost,
		@Res() res: Response,
	) {
		res.send(await this.dbChatRoomService.update(userId, userPost));
	}

	@Delete(":id")
	async delete(@Param("id") userId: number, @Res() res: Response) {
		res.send(await this.dbChatRoomService.delete(userId));
	}
}
