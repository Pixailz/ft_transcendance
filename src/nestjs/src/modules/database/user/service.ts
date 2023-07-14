import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./entity";
import { UserInfoEntity } from "../userInfo/entity";

import { UserPost } from "./dto";
import { Api42Service } from "src/modules/api42/api42.service";

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
		userInfo.name = userPost.ft_login;
		userInfo.user_id = user;
		
		await this.userInfoRepo.save(userInfo);
		return user.id;
	}

	async returnOneByAuthCode(code: string): Promise<UserEntity> {
		const api42Service = new Api42Service();
		const user42 = await api42Service.getUserFromCode(code);
		
		const user = await this.userRepo.findOneBy({ ft_login: user42.login });
		if (!user) {
			return null;
		}
		return user;
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
