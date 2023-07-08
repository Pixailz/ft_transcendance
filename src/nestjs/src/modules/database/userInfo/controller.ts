import { Body, Controller, Post, Req, Res, Get, Param } from "@nestjs/common";
import { Response } from "express";

import { UserInfoService } from "./service";
import { UserInfoPost } from "./dto";

@Controller("user_info")
export class UserInfoController {
	constructor(private readonly userInfoService: UserInfoService) {}

	@Post()
	register(@Body() post: UserInfoPost) {
		console.log(post);
		return this.userInfoService.create(post);
	}

	@Get()
	async getAll(
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.returnAll());
	}

	@Get(":id")
	async getOne(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.returnOne(userId));
	}
}

