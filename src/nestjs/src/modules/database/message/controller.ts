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

import { MessageService } from "./service";
import { MessagePost } from "./dto";

@Controller("message")
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post()
	create(@Body() post: MessagePost) {
		return this.messageService.create(post);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.messageService.returnAll());
	}

	// @Get(":id")
	// async getOne(@Param("id") MessageId: number, @Res() res: Response) {
	// 	res.send(await this.messageService.returnOne(MessageId));
	// }

	// @Put(":id")
	// async update(
	// 	@Param("id") MessageId: number,
	// 	@Body() MessagePost: MessagePost,
	// 	@Res() res: Response,
	// ) {
	// 	res.send(await this.messageService.update(MessageId, MessagePost));
	// }

	// @Delete(":id")
	// async delete(@Param("id") MessageId: number, @Res() res: Response) {
	// 	res.send(await this.messageService.delete(MessageId));
	// }
}
