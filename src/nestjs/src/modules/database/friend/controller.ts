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

import { DBFriendService } from "./service";
import { DBFriendPost } from "./dto";

@Controller("db/friend")
export class DBFriendController {
	constructor(private readonly dbFriendService: DBFriendService) {}

	@Post(":friend_id")
	create(
		@Param("friend_id") friendId: number,
		@Body() post: DBFriendPost) {
		return this.dbFriendService.create(post, friendId);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbFriendService.returnAll());
	}

	@Get(":id/:friend_id")
	async getOne(
		@Param("friend_id") friendId: number,
		@Param("id") userId: number,
		@Res() res: Response) {
		res.send(await this.dbFriendService.returnOne(userId, friendId));
	}

	// @Put(":id/:friend_id")
	// async update(
	// 	@Param("id") userId: number,
	// 	@Param("friend_id") friendId: number,
	// 	@Body() userPost: DBFriendPost,
	// 	@Res() res: Response,
	// ) {
	// 	res.send(await this.dbFriendService.update(userId, friendId, userPost));
	// }

	@Delete(":id/:friend_id")
	async delete(
		@Param("id") userId: number,
		@Param("friend_id") friendId: number,
		@Res() res: Response) {
		res.send(await this.dbFriendService.delete(userId, friendId));
	}
}
