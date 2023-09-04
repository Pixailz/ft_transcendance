import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	Param,
	Request,
} from "@nestjs/common";

import { DBFriendRequestService } from "./service";
import { DBFriendRequestPost } from "./dto";

@Controller("db/friendRequest")
export class DBFriendRequestController {
	constructor(private readonly dbFriendRequestService: DBFriendRequestService) {}

	@Post()
	create(
		@Request() req,
		@Body() post: DBFriendRequestPost) {
		const userId = req.user.user_id;
		return this.dbFriendRequestService.create(post, userId);
	}

	@Get()
	async getAll() {
		return (await this.dbFriendRequestService.returnAll());
	}

	@Get("me")
	async getMyRequest(
		@Request() req) {
		const userId = req.user.user_id;
		return (await this.dbFriendRequestService.getAllRequest(userId));
	}

	@Delete("/accept/:friend_id")
	async acceptReq(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendRequestService.acceptReq(friendId, userId));
	}

	@Delete("/decline/:friend_id")
	async declineReq(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendRequestService.rejectReq(friendId, userId));
	}

	@Get(":friend_id")
	async getOne(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendRequestService.returnOne(userId, friendId));
	}

	@Delete(":friend_id")
	async delete(
		@Request() req,
		@Param("friend_id") friendId: number) {
		const userId = req.user.user_id;
		return (await this.dbFriendRequestService.delete(userId, friendId));
	}
}
