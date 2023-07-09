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

	// async create(userPost: UserPost) {
	// 	console.log(userPost);
	// 	return await this.userRepo.save(userPost);
	// }


	async create(userPost: UserPost) {
		
		const user = new UserEntity();
		const userInfo = new UserInfoEntity();
		
		user.ft_id = userPost.ft_id;
		user.ft_login = userPost.ft_login;

		await this.userRepo.save(user);
		// await this.userInfoRepo.save(userInfo);
		// console.log('id = ', userInfo.id);	
		
		userInfo.user_id = user;
		userInfo.nickname = userPost.ft_login + '_name';
		
		user.info_id = userInfo;
		await this.userInfoRepo.save(userInfo);
		
		await this.userInfoRepo.update(userInfo.id, {email: userInfo.nickname + '@mail.com'});
		console.log('my nickname = ', user.info_id.nickname)
		// return from(this.userInfoRepo.save(userInfo));
		return "User created\n";
	  }

	async returnAll() {
		return await this.userRepo.find();
	}

	async returnOne(userId: number) {
		console.log(userId);
		return await this.userRepo.findOneBy({ ft_id: userId });
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
