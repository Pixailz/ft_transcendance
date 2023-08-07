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

import { DBUserService } from "./service";
import { DBUserPost, DBUserInfoPost } from "./dto";

@Controller("db/user")
export class DBUserController {
	constructor(private readonly dbUserService: DBUserService) {}

	@Post()
	async create(@Body() post: DBUserPost) {
		return this.dbUserService.create(post);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbUserService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") userId: number, @Res() res: Response) {
		res.send(await this.dbUserService.returnOne(userId));
	}

	@Put(":id")
	async update(
		@Param("id") userId: number,
		@Body() userPost: DBUserInfoPost,
		@Res() res: Response,
	) {
		res.send(await this.dbUserService.update(userId, userPost));
	}

	@Delete(":id")
	async delete(@Param("id") userId: number, @Res() res: Response) {
		const user = await this.dbUserService.delete(userId);
		if (user) res.send(await this.dbUserService.delete(userId));
		else console.log("in delete user nb : ", userId, " not found");
	}
}
