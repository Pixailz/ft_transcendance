import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Request,
} from "@nestjs/common";

import { DBFriendService } from "./service";
import { DBFriendPost } from "./dto";

@Controller("db/friend")
export class DBFriendController {
	constructor(private readonly dbFriendService: DBFriendService) {}

	@Post()
	create(
		@Request() req,
		@Body() post: DBFriendPost) {
		const userId = req.user.user_id;
		return this.dbFriendService.create(post, userId);
	}

	@Get()
	async getAll() {
		return (await this.dbFriendService.returnAll());
	}

	@Get("/alreadyFriend/:friend_id")
	async alreadyFriend(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendService.alreadyFriend(userId, friendId));
	}

	@Get(":friend_id")
	async getOne(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendService.returnOne(userId, friendId));
	}

	@Delete(":friend_id")
	async delete(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendService.delete(userId, friendId));
	}
}
