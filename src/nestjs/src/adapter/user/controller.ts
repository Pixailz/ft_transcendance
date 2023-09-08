import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Put,
	Request,
	UseInterceptors,
} from "@nestjs/common";
import { DBUserInfoPost } from "../../modules/database/user/dto";
import { DBUserService } from "../../modules/database/user/service";
import { UserEntity } from "src/modules/database/user/entity";

@UseInterceptors(ClassSerializerInterceptor)
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

	@Get("profile/:login")
	async getUserProfile(@Param("login") ft_login: string): Promise<UserEntity> {
		return await this.dbUserService.getUserByLogin(ft_login);
	}

	// @Get("info/:id")
	// async getUserById(@Param("id") id: number) {
	// 	return await this.dbUserService.returnOne(id);
	// }

	@Get("nonce")
	async get_nonce(@Request() req): Promise<{ nonce: string }> {
		return await this.dbUserService.getNonce(req.user.user_id);
	}

	@Get("online")
	async getOnlineUsers(): Promise<UserEntity[]> {
		return await this.dbUserService.getOnlineUsers();
	}
}
