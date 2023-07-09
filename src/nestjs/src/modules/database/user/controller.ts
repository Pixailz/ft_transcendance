import { Body, Controller, Post, Put, Get, Delete, Res, Param } from "@nestjs/common";
import { Response } from "express";

import { UserService } from "./service";
import { UserPost } from "./dto";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() post: UserPost) {
		return this.userService.create(post);
	}

	@Get()
	async getAll(
		@Res() res: Response,
	) {
		res.send(await this.userService.returnAll());
	}

	@Get(":id")
	async getOne(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.userService.returnOne(userId));
	}

	@Put(":id")
	async update(
		@Param("id") userId: number,
		@Body() userPost: UserPost,
		@Res() res: Response,
	) {
		res.send(await this.userService.update(userId, userPost));
	}

	@Delete(":id")
	async delete(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.userService.delete(userId));
	}
}

