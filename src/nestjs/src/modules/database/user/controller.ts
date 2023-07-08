import { Body, Controller, Post, Req, Res, Get, Param } from "@nestjs/common";
import { Response } from "express";

import { UserService } from "./service";
import { UserPost } from "./dto";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	register(@Body() post: UserPost) {
		console.log(post);
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
}

