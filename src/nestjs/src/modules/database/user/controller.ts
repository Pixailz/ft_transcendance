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

import { dbUserService } from "./service";
import { UserPost, UserInfoPost } from "./dto";

@Controller("db/user")
export class dbUserController {
	constructor(private readonly userService: dbUserService) {}

	@Post()
	async create(@Body() post: UserPost) {
		return this.userService.create(post);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.userService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") userId: number, @Res() res: Response) {
		res.send(await this.userService.returnOne(userId));
	}

	@Put(":id")
	async update(
		@Param("id") userId: number,
		@Body() userPost: UserInfoPost,
		@Res() res: Response,
	) {
		res.send(await this.userService.update(userId, userPost));
	}

	@Delete(":id")
	async delete(@Param("id") userId: number, @Res() res: Response) {
		const user = await this.userService.delete(userId);
		if (user) res.send(await this.userService.delete(userId));
		else console.log("in delete user nb : ", userId, " not found");
	}
}
