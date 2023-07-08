import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserInfoEntity } from "./entity";
import { UserInfoPost } from "./dto";

@Injectable()
export class UserInfoService {
	constructor(
		@InjectRepository(UserInfoEntity)
		private readonly userInfoRepo: Repository<UserInfoEntity>
	) {}

	async create(userInfoPost: UserInfoPost) {
		console.log(userInfoPost);
		return await this.userInfoRepo.save(userInfoPost);
	}

	async returnAll() {
		return await this.userInfoRepo.find();
	}

	async returnOne(userInfoId: number) {
		console.log(userInfoId);
		return await this.userInfoRepo.findOneBy({ id: userInfoId });
	}
}
