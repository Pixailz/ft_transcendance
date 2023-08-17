import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { DBUserInfoPost } from "../../modules/database/user/dto";
import { DBUserService } from "../../modules/database/user/service";
import { UserEntity } from "src/modules/database/user/entity";

@Controller("user")
export class UserController {
	constructor(private dbUserService: DBUserService) {}

	@Get("me")
	async get_info_me(@Request() req): Promise<UserEntity | any> {
		const user_info = await this.dbUserService.returnOne(req.user.user_id);
		if (!user_info) return { id: -1 };
		return user_info;
	}

	@Put("me")
	async update_info_me(
		@Request() req,
		@Body() userPost: DBUserInfoPost,
	): Promise<UserEntity> {
		await this.dbUserService.update(req.user.user_id, userPost);
		return await this.dbUserService.returnOne(req.user.user_id);
	}
}
