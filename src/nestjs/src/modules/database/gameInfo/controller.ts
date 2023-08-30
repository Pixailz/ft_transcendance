import {
	Body,
	Controller,
	Post,
	Put,
	Get,
	Delete,
	Param,
} from "@nestjs/common";

import { DBGameInfoService } from "./service";
import { DBGameInfoPost } from "./dto";

@Controller("db/game_info")
export class DBGameInfoController {
	constructor(private readonly dbGameInfoService: DBGameInfoService) {}

	@Post(":userA/:userB")
	create(
		@Param("userA") userAA: number,
		@Param("userB") userBB: number,
		@Body() post: DBGameInfoPost,
	) {
		return this.dbGameInfoService.create(post, userAA, userBB);
	}

	@Get()
	async getAll() {
		return (await this.dbGameInfoService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") gameId: number) {
		return (await this.dbGameInfoService.returnOne(gameId));
	}

	@Put(":id")
	async update(
		@Param("id") gameId: number,
		@Body() userPost: DBGameInfoPost) {
		return (await this.dbGameInfoService.update(gameId, userPost));
	}

	@Delete(":id")
	async delete(@Param("id") userId: number) {
		return (await this.dbGameInfoService.delete(userId));
	}
}
