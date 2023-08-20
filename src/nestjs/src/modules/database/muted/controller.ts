import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	Res,
	Param,
} from "@nestjs/common";
import { Response } from "express";

import { DBMutedService } from "./service";
import { DBMutedPost } from "./dto";

@Controller("db/muted")
export class DBMutedController {
	constructor(private readonly dbMutedService: DBMutedService) {}

	@Post(":muted_id")
	create(
		@Param("muted_id") MutedId: number,
		@Body() post: DBMutedPost) {
		return this.dbMutedService.create(post, MutedId);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbMutedService.returnAll());
	}

	@Get(":id/:muted_id")
	async getOne(
		@Param("muted_id") MutedId: number,
		@Param("id") userId: number,
		@Res() res: Response) {
		res.send(await this.dbMutedService.returnOne(userId, MutedId));
	}

	@Delete(":id/:muted_id")
	async delete(
		@Param("id") userId: number,
		@Param("muted_id") MutedId: number,
		@Res() res: Response) {
		res.send(await this.dbMutedService.delete(userId, MutedId));
	}
}
