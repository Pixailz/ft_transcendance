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
	async getAll(@Res() res: Response) {
		res.send(await this.dbGameInfoService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") gameId: number, @Res() res: Response) {
		res.send(await this.dbGameInfoService.returnOne(gameId));
	}

	@Put(":id")
	async update(
		@Param("id") gameId: number,
		@Body() userPost: DBGameInfoPost,
		@Res() res: Response,
	) {
		res.send(await this.dbGameInfoService.update(gameId, userPost));
	}

	@Delete(":id")
	async delete(@Param("id") userId: number, @Res() res: Response) {
		res.send(await this.dbGameInfoService.delete(userId));
	}
}
