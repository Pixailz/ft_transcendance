import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Request,
} from "@nestjs/common";

import { DBMutedService } from "./service";
import { DBMutedPost } from "./dto";

@Controller("db/muted")
export class DBMutedController {
	constructor(private readonly dbMutedService: DBMutedService) {}

	@Post()
	create(
		@Request() req,
		@Body() post: DBMutedPost) {
		const mutedId = req.user.user_id;
		return (this.dbMutedService.create(post, mutedId));
	}

	@Get()
	async getAll() {
		return (await this.dbMutedService.returnAll());
	}

	@Get(":muted_id")
	async getOne(
		@Request() req,
		@Param("muted_id") mutedId: number) {
		const userId = req.user.user_id;
		return (await this.dbMutedService.returnOne(userId, mutedId));
	}

	@Delete(":muted_id")
	async delete(
		@Request() req,
		@Param("muted_id") mutedId: number) {
		const userId = req.user.user_id;
		return (await this.dbMutedService.delete(userId, mutedId));
	}
}
