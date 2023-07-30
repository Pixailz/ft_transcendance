import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./entity";

import { UserPost, UserInfoPost } from "./dto";
import { Api42Service } from "src/modules/api42/api42.service";
import { UserChatRoomEntity } from "../userChatRoom/entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(userPost: UserPost) {
		const user = new UserEntity();
		user.ftLogin = userPost.ftLogin;
		await this.userRepo.save(user);
		return user.id;
	}

	async returnOneByAuthCode(code: string): Promise<UserEntity> {
		const api42Service = new Api42Service();
		const user42 = await api42Service.getUserFromCode(code);

		const user = await this.userRepo.findOneBy({ ftLogin: user42.login });
		if (!user) {
			return null;
		}
		return user;
	}

	async returnAll() {
		return await this.userRepo.find();
	}

	async returnOne(userId?: number, ft_login?: string) {
		if (userId) 
			return await this.userRepo.findOneBy({ id: userId });
		return null;
	}

	async update(userId: number, userPost: UserInfoPost) {
		return await this.userRepo.update(userId, userPost);
	}
	
	async delete(userId: number) {
		console.log(userId);
		return await this.userRepo.delete({id : userId});
	}
	
		// async updateAll(userId: number, userPost: UserInfoPost) {
		// 	const user = await this.userRepo.findOneBy({ id: userId });
		// 	user.nickname = userPost.nickname;
		// 	user.email = userPost.email;
		// 	user.picture  = userPost.picture;
		// 	user.twoAuthFactor = userPost.twoAuthFactor;
		// 	if picture not set, set a default value
		// 	return await this.userRepo.save(user);
		// }
}
