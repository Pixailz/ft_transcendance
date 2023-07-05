import { Body, Controller, Post, Req, Res, Get, Param } from "@nestjs/common";
import { Request, Response } from "express";
import { DbService } from "./database.service";

export class UserPost {
	ft_login?: string;
	ft_id?: number;
}

export class UserInfoPost {
	picture?: string;
	nickname?: string;
	name?: string;
	email?: string;
}

@Controller("db")
export class DbController {
	constructor(private readonly dbService: DbService) {}

	@Post("create")
	create(@Body() post: UserPost) {
		console.log(post);
		return this.dbService.createUser(post);
	}

	@Post("register")
	register(@Body() post: UserInfoPost) {
		console.log(post);
		return this.dbService.registerUser(post);
	}

	@Get("get/:id")
	async getUser(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.dbService.returnUser(userId));
	}

	@Get("get/info/:id")
	async getUserInfo(
		@Param("id") userId: number,
		@Res() res: Response,
	) {
		res.send(await this.dbService.returnUserInfo(userId));
	}
}
