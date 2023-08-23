import { ForbiddenException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./entity";

import { DBUserPost, DBUserInfoPost } from "./dto";
import { Api42Service } from "../../api42/service";

@Injectable()
export class DBUserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(userPost: DBUserPost) {
		const user = new UserEntity();
		const nb = userPost.ftLogin.trim().length;
		if (nb === 0)
			throw new ForbiddenException("User Login can't be blank or empty");
		user.ftLogin = userPost.ftLogin;
		await this.userRepo.save(user);
		return user.id;
	}

	async returnOneByAuthCode(code: string): Promise<UserEntity> {
		const api42Service = new Api42Service();
		const user42 = await api42Service.getUserFromCode(code);

		const user = await this.get_user(null, user42.login);
		return user;
	}

	async returnAll() {
		return await this.userRepo.find();
	}

	async returnOne(userId?: number, ft_login?: string) {
		return await this.get_user(userId, ft_login);
	}

	async update(userId: number, userPost: DBUserInfoPost) {
		const user = await this.get_user(userId, null);
		if (user) return await this.userRepo.update(userId, userPost);
		else throw new ForbiddenException("User not found");
	}

	async delete(userId: number) {
		const user = await this.get_user(userId, null);
		if (user) return await this.userRepo.delete({ id: userId });
		else throw new ForbiddenException("User not found");
	}

	async get_user(
		userId: number | null,
		ft_login: string | null,
	): Promise<UserEntity> | null {
		if (userId) {
			const user = await this.userRepo.findOneBy({ id: userId });
			if (user) return user;
		}
		if (ft_login) {
			const user = await this.userRepo.findOneBy({ ftLogin: ft_login });
			if (user) return user;
		}
		return null;
	}

	async getUserByLogin(ft_login: string | undefined): Promise<UserEntity> {
		if (!ft_login) {
			Promise.reject({status: "not found"});
		}
		const user_info: UserEntity = await this.userRepo.findOne({
			where : {
				ftLogin: ft_login,
			}
		});
		return Promise.resolve(user_info);
	}
}
