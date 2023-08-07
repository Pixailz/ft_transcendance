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

import { DBMessageService } from "./service";
import { DBMessagePost } from "./dto";

@Controller("db/message")
export class DBMessageController {
	constructor(private readonly dbMessageService: DBMessageService) {}

	@Post(":user_id/:chat_id")
	create(
		@Param("user_id") userId: number,
		@Param("chat_id") chatId: number,
		@Body() post: DBMessagePost,
	) {
		return this.dbMessageService.create(post, userId, chatId);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbMessageService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") MessageId: number, @Res() res: Response) {
		res.send(await this.dbMessageService.returnOne(MessageId));
	}

	@Put(":id")
	async update(
		@Param("id") MessageId: number,
		@Body() MessagePost: DBMessagePost,
		@Res() res: Response,
	) {
		res.send(await this.dbMessageService.update(MessageId, MessagePost));
	}

	@Delete(":id")
	async delete(@Param("id") MessageId: number, @Res() res: Response) {
		res.send(await this.dbMessageService.delete(MessageId));
	}
}
