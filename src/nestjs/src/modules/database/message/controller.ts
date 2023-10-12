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

import { DBMessageService } from "./service";
import { DBMessagePost } from "./dto";

@Controller("db/message")
export class DBMessageController {
	constructor(private readonly dbMessageService: DBMessageService) {}

	@Post(":chat_id")
	create(
		@Request() req,
		@Param("chat_id") chatId: number,
		@Body() post: DBMessagePost,
	) {
		const userId = req.user.user_id;
		// return this.dbMessageService.create(post, userId, chatId);
	}

	@Get()
	async getAll() {
		return await this.dbMessageService.returnAll();
	}

	@Get(":id")
	async getOne(@Param("id") MessageId: number) {
		return await this.dbMessageService.returnOne(MessageId);
	}

	@Put(":id")
	async update(
		@Param("id") MessageId: number,
		@Body() MessagePost: DBMessagePost,
	) {
		// return await this.dbMessageService.update(MessageId, MessagePost);
	}

	@Delete(":id")
	async delete(@Param("id") MessageId: number) {
		return await this.dbMessageService.delete(MessageId);
	}
}
