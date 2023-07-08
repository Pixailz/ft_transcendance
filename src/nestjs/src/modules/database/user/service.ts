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
