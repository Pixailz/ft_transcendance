import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./entity";
import { UserPost } from "./dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>
	) {}

	async create(userPost: UserPost) {
		console.log(userPost);
		return await this.userRepo.save(userPost);
	}

	async returnAll() {
		return await this.userRepo.find();
	}

	async returnOne(userId: number) {
		console.log(userId);
		return await this.userRepo.findOneBy({ ft_id: userId });
	}
}
