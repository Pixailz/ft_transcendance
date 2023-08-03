import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { userService } from "./user.service";
import { UserInfoPost } from "../database/user/dto";
import { dbUserService } from "../database/user/service";

@Controller("user")
export class userController {
	constructor (private UserService: userService, private DbUserService: dbUserService) {}

	@Get("me")
	async get_info_me(@Request() req) {
		const user_info = await this.UserService.get_user_info(req);

		if (!user_info)
			return null;

		return user_info;
	}

	@Put("me")
	async update_info_me(@Request() req, @Body() userPost: UserInfoPost,) {
		const user_id = await this.UserService.get_user_id(req);

		await this.DbUserService.update(user_id, userPost);

		return {status: "oke"};
	}
}
