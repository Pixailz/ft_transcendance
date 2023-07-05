import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { from, Observable } from "rxjs";

import { UserEntity, UserInfoEntity } from "./database.entity";
import { UserPost, UserInfoPost } from "./database.controller";

@Injectable()
export class DbService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		@InjectRepository(UserInfoEntity)
		private readonly userInfoRepo: Repository<UserInfoEntity>
	) {}

	createUser(userPost: UserPost){
		console.log(userPost);
		return from(this.userRepo.save(userPost));
	}

	registerUser(userInfoPost: UserInfoPost){
		console.log(userInfoPost);
		return from(this.userInfoRepo.save(userInfoPost));
	}

	async returnUser(userId: number){
		console.log(userId);
		return await this.userRepo.findOneBy({ ft_id: userId })
	}

	async returnUserInfo(userId: number){
		console.log(userId);
		return await this.userInfoRepo.findOneBy({ id: userId })
	}
}
