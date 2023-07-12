import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./entity";
import { UserInfoEntity } from "../userInfo/entity";

import { UserPost } from "./dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		@InjectRepository(UserInfoEntity)
		private readonly userInfoRepo: Repository<UserInfoEntity>,
	) {}

	async create(userPost: UserPost) {
		
		const user = new UserEntity();
		
		user.ft_login = userPost.ft_login;
		
		await this.userRepo.save(user);

		const userInfo = new UserInfoEntity();
		userInfo.nickname = userPost.ft_login + '_name';
		userInfo.name = userPost.ft_login;
		userInfo.user_id = user;
		
		await this.userInfoRepo.save(userInfo);
		return user.id;
	  }

	async returnAll() {
		return await this.userRepo.find();
	}

	async returnOne(userId: number) {
		console.log(userId);
		return await this.userRepo.findOneBy({ id: userId });
	}

	async update(userId: number, userPost: UserPost) {
		console.log(userId);
		console.log(userPost);
		return await this.userRepo.update(userId, userPost);
	}

	async delete(userId: number) {
		console.log(userId);
		return await this.userRepo.delete(userId);
	}
}
