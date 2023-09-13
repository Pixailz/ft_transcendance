import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Request,
} from "@nestjs/common";

import { DBNotificationService } from "./service";

@Controller("db/notification")
export class DBNotificationController {
	constructor(
		private readonly dbNotificationService: DBNotificationService)
	{}

	// @Post(":id")
	// create(
	// 	@Body() post: DBNotificationPost,
	// 	@Param("id") userId: number ){
	// 	const request = this.dbNotificationService.create(post);
	// 	return (request);
	// }

	@Get()
	async getAll() {
		return (await this.dbNotificationService.returnAll());
	}

	@Get(":id")
	async getOne(
		@Param("id") id: number) {
		return (await this.dbNotificationService.returnOne(id));
	}

	@Delete(":id")
	async delete(
		@Param("id") id: number) {
		return (await this.dbNotificationService.delete(id));
	}
}
