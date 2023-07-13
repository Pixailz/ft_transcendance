import { Body, Controller, Post, Put, Get, Delete, Res, Req, Param } from "@nestjs/common";
import { Response } from "express";

import { UserInfoService } from "./service";
import { UserInfoPost } from "./dto";

@Controller("user_info")
export class UserInfoController {
	constructor(private readonly userInfoService: UserInfoService) {}

	@Post()
	create(@Body() post: UserInfoPost) {
		return this.userInfoService.create(post);
	}

	@Get()
	async getAll(
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.returnAll());
	}

	@Get("me")
	async getMe(
		@Req() req: Request,
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.returnMe(req));
	}

	@Get(":id")
	async getOne(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.returnOne(userId));
	}

	@Put(":id")
	async update(
		@Param("id") userId: number,
		@Body() userPost: UserInfoPost,
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.update(userId, userPost));
	}

	@Delete(":id")
	async delete(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.userInfoService.delete(userId));
	}
}

