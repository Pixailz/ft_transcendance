import {
	NotFoundException,
	Injectable,
	BadRequestException,
	InternalServerErrorException,
	ConflictException,
} from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Elo } from "../elo";


import { Status, UserEntity } from "./entity";

import { DBUserPost, DBUserInfoPost } from "./dto";
import { Api42Service } from "../../api42/service";
import { Sanitize } from "../sanitize-object";
import { UserMetricsEntity } from "../metrics/entity";



@Injectable()
export class DBUserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		@InjectRepository(UserMetricsEntity)
		private readonly userMetricsRepo: Repository<UserMetricsEntity>,
		private sanitize: Sanitize,
		private elo: Elo,
	) {}

	async create(userPost: DBUserPost): Promise<number> {
		const user = new UserEntity({});
		if (userPost.ftLogin === "")
			throw new BadRequestException("User Login can't be blank or empty");
		user.ftLogin = userPost.ftLogin;
		user.metrics = new UserMetricsEntity(user);
		user.achievements = [];
		await this.userRepo.save(user);
		await this.userMetricsRepo.save(user.metrics);
		return user.id;
	}

	async returnOneByAuthCode(code: string): Promise<UserEntity> {
		const api42Service = new Api42Service();
		const user42 = await api42Service.getUserFromCode(code);

		const user = await this.get_user(null, user42.login, null);
		return user;
	}

	async returnOneByNonce(nonce: string): Promise<UserEntity> {
		const user = await this.userRepo.findOneBy({ nonce: nonce });
		return user;
	}

	async returnAll(): Promise<UserEntity[]> {
		return await this.userRepo.find();
	}

	async returnOne(userId?: number, ft_login?: string, nickname?: string): Promise<UserEntity> {
		return await this.get_user(userId, ft_login, nickname);
	}

	async updateElo(player_1: number, player_2: number, winner: number)
	{
		if (winner == -1) return;
		let user_1 = await this.get_user(player_1, null, null);
		let user_2 = await this.get_user(player_2, null, null);
		if (!user_1 || !user_2) throw new NotFoundException("User not found");

		let gain_1 = this.elo.get_gain(user_1.elo, user_2.elo);
		let gain_2 = this.elo.get_gain(user_2.elo, user_1.elo);
		if (winner == player_1)
		{
			user_1.elo += gain_1;
			user_2.elo -= gain_1;
		}
		else
		{
			user_2.elo -= gain_2;
			user_2.elo += gain_2;
		}
		await this.userRepo.update(player_1, user_1);
		await this.userRepo.update(player_2, user_2);
	}

	async update(userId: number, userPost: DBUserInfoPost) {
		const user = await this.get_user(userId, null, null);
		if (!user) throw new NotFoundException("User not found");
		if (userPost.nickname)
		{
			if (userPost.nickname.length > 120)
				userPost.nickname = userPost.nickname.substring(0, 120);
			const nickname = this.replace_nickname(userPost.nickname);
			if (nickname.length <= 2)
				throw new BadRequestException("Invalid nickname");
			const check_name = await this.userRepo.findOneBy({
				nickname: ILike(nickname),
			});
			if (check_name)
				throw new ConflictException("Nickname already taken");
			userPost.nickname = nickname;
		}
		return await this.userRepo.update(userId, userPost);
	}

	async delete(userId: number) {
		const user = await this.get_user(userId, null, null);
		if (user) return await this.userRepo.delete({ id: userId });
		else throw new NotFoundException("User not found");
	}

	async get_user(
		userId: number | null,
		ft_login: string | null,
		nickname: string | null,
	): Promise<UserEntity> | null {
		if (userId) {
			const user = await this.userRepo.findOneBy({ id: userId });
			if (user) return user;
		}
		if (ft_login) {
			const user = await this.userRepo.findOneBy({ ftLogin: ft_login });
			if (user) return user;
		}
		if (nickname) {
			const user = await this.userRepo.findOneBy({ nickname: ILike(nickname) });
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

    replace_nickname(name: string) : string
    {
        const	accept_char: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-0123456789"
        let		new_name: string = '';
        if (!name)
            return (name);
        for (let i: number = 0; i < name.length; i++)
        {
            for (let j:number = 0; j < accept_char.length; j++)
            {
                if (accept_char[j] === name[i])
                {
                    new_name += name[i];
                    break;
                }
            }
        }
        return (new_name);
    }
}
