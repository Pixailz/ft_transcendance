import {
	NotFoundException,
	Injectable,
	BadRequestException,
	InternalServerErrorException,
	ConflictException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Status, UserEntity } from "./entity";

import { DBUserPost, DBUserInfoPost } from "./dto";
import { Api42Service } from "../../api42/service";
import { Sanitize } from "../../../sanitize-object";

@Injectable()
export class DBUserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		private sanitize: Sanitize,
	) {}

	async create(userPost: DBUserPost): Promise<number> {
		const user = new UserEntity({});
		if (userPost.ftLogin === "")
			throw new BadRequestException("User Login can't be blank or empty");
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

	async returnAll(): Promise<UserEntity[]> {
		return await this.userRepo.find();
	}

	async returnOne(userId?: number, ft_login?: string): Promise<UserEntity> {
		return await this.get_user(userId, ft_login);
	}

	async update(userId: number, userPost: DBUserInfoPost) {
		const user = await this.get_user(userId, null);
		if (!user) throw new NotFoundException("User not found");
		if (userPost.nickname)
		{
			let nickname = userPost.nickname.trim();
			if (nickname.length <= 2)
				throw new BadRequestException("Invalid nickname");
			const check_name = await this.userRepo.findOneBy({
				nickname: nickname,
			});
			if (check_name)
				throw new ConflictException("Nickname already taken");
			userPost.nickname = nickname;
		}
		return await this.userRepo.update(userId, userPost);
	}

	async delete(userId: number) {
		const user = await this.get_user(userId, null);
		if (user) return await this.userRepo.delete({ id: userId });
		else throw new NotFoundException("User not found");
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

	async getNonce(userId: number): Promise<any> {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const crypto = require("crypto");
		const nonce = crypto.getRandomValues(new Uint8Array(16)).join("");
		await this.userRepo.update(userId, { nonce: nonce }).catch((err) => {
			console.log(err);
			throw new InternalServerErrorException(
				"Error setting nonce: " + err,
			);
		});
		return { nonce: nonce };
	}

	async getUserByLogin(ft_login: string | undefined): Promise<UserEntity> {
		if (!ft_login) {
			Promise.reject({ status: "not found" });
		}
		const user_info: UserEntity = await this.userRepo.findOne({
			where: {
				ftLogin: ft_login,
			},
		});
		return Promise.resolve(user_info);
	}

	async getOnlineUsers(): Promise<UserEntity[]> {
		const users = await this.userRepo.find({
			where: {
				status: Status.CONNECTED,
			},
		});
		return this.sanitize.Users(users);
	}

	async setStatus(user_id: number, status: number) {
		const date = new Date(Date.now());

		await this.update(user_id, {
			status: status,
			lastSeen: date,
		}).catch((err) => {
			console.log("[userService:setStatus]", err.message);
		});
	}
}
