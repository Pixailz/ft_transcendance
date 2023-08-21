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

import { DBFriendRequestService } from "./service";
import { DBFriendRequestPost } from "./dto";

@Controller("db/friendRequest")
export class DBFriendRequestController {
	constructor(private readonly dbFriendRequestService: DBFriendRequestService) {}

	@Post(":friendRequest_id")
	create(
		@Param("friend_id") friendtId: number,
		@Body() post: DBFriendRequestPost) {
		return this.dbFriendRequestService.create(post, friendtId);
	}

	@Get()
	async getAll(@Res() res: Response) {
		res.send(await this.dbFriendRequestService.returnAll());
	}

	@Get(":id/:friendRequest_id")
	async getOne(
		@Param("friend_id") friendtId: number,
		@Param("id") userId: number,
		@Res() res: Response) {
		res.send(await this.dbFriendRequestService.returnOne(userId, friendtId));
	}

	// @Put(":id/:friendRequest_id")
	// async update(
	// 	@Param("id") userId: number,
	// 	@Param("friend_id") friendtId: number,
	// 	@Body() userPost: DBFriendRequestPost,
	// 	@Res() res: Response,
	// ) {
	// 	res.send(await this.dbFriendRequestService.update(userId, friendtId, userPost));
	// }

	@Delete(":id/:friendRequest_id")
	async delete(
		@Param("id") userId: number,
		@Param("friend_id") friendtId: number,
		@Res() res: Response) {
		res.send(await this.dbFriendRequestService.delete(userId, friendtId));
	}
}
