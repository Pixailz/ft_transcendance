import {
	Body,
	Controller,
	Post,
	Put,
	Get,
	Delete,
	Param,
	UseInterceptors,
	ClassSerializerInterceptor,
} from "@nestjs/common";

import { DBUserService } from "./service";
import { DBUserPost, DBUserInfoPost } from "./dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("db/user")
export class DBUserController {
	constructor(private readonly dbUserService: DBUserService) {}

	@Post()
	async create(@Body() post: DBUserPost) {
		return this.dbUserService.create(post);
	}

	@Get()
	async getAll() {
		return (await this.dbUserService.returnAll());
	}

	@Get(":id")
	async getOne(@Param("id") userId: number) {
		return (await this.dbUserService.returnOne(userId));
	}

	@Put(":id")
	async update(
		@Param("id") userId: number,
		@Body() userPost: DBUserInfoPost) {
		return (await this.dbUserService.update(userId, userPost));
	}

	@Delete(":id")
	async delete(@Param("id") userId: number) {
			return (await this.dbUserService.delete(userId));
	}
}
