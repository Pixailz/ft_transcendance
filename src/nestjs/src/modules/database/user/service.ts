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

	async returnOneByNonce(nonce: string): Promise<UserEntity> {
		const user = await this.userRepo.findOneBy({ nonce: nonce });
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

	async getNonce(userId: number): Promise<string> {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const crypto = require("crypto");
		const nonce = crypto.getRandomValues(new Uint8Array(16)).join("");
		await this.userRepo.update(userId, { nonce: nonce }).catch((err) => {
			console.log(err);
			throw new ForbiddenException("Error setting nonce: " + err);
		});
		return nonce;
	}
}
