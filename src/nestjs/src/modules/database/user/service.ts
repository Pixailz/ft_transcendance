import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
		const user = await this.userRepo.findOneBy({ id: userId });
		if (user) 
			return (user);
		else
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
	}

	async update(userId: number, userPost: UserInfoPost) {
		const user = await this.userRepo.findOneBy({ id: userId });
		if (user) 
			return await this.userRepo.update(userId, userPost);
		else
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
	}
	
	async delete(userId: number) {
		const user = await this.userRepo.findOneBy({ id: userId });
		if (user) 
			return await this.userRepo.delete({id : userId});
		else
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
	}
}
