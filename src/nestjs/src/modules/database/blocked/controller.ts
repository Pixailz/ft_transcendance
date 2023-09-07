import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Request,
} from "@nestjs/common";

import { DBBlockedService } from "./service";
import { DBBlockedPost } from "./dto";

@Controller("db/blocked")
export class DBBlockedController {
	constructor(private readonly dbBlockedService: DBBlockedService) {}

	@Post()
	create(
		@Request() req,
		@Body() post: DBBlockedPost) {
		const BlockedId = req.user.user_id;
		return (this.dbBlockedService.create(post, BlockedId));
	}

	@Get()
	async getAll() {
		return (await this.dbBlockedService.returnAll());
	}

	@Get(":Blocked_id")
	async getOne(
		@Request() req,
		@Param("Blocked_id") BlockedId: number) {
		const userId = req.user.user_id;
		return (await this.dbBlockedService.returnOne(userId, BlockedId));
	}

	@Delete(":Blocked_id")
	async delete(
		@Request() req,
		@Param("Blocked_id") BlockedId: number) {
		const userId = req.user.user_id;
		return (await this.dbBlockedService.delete(userId, BlockedId));
	}
}
