import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { DBUserInfoPost } from "../database/user/dto";
import { DBUserService } from "../database/user/service";

@Controller("user")
export class UserController {
	constructor(
		private dbUserService: DBUserService,
	) {}

	@Get("me")
	async get_info_me(@Request() req) {
		return (await this.dbUserService.returnOne(req.user.user_id));
	}

	@Put("me")
	async update_info_me(@Request() req, @Body() userPost: DBUserInfoPost) {
		await this.dbUserService.update(req.user.user_id, userPost);
		return { status: "oke" };
	}
}
