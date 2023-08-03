import { Injectable, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GameInfoEntity } from "./entity";
import { GameInfoPost } from "./dto";

import { UserEntity } from "../user/entity";

@Injectable()
export class GameInfoService {
	constructor(
		@InjectRepository(GameInfoEntity)
		private readonly gameInfoRepo: Repository<GameInfoEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: GameInfoPost, userA: number, userB: number) {
		const gameInfo = new GameInfoEntity();
		const user1 = await this.userRepo.findOneBy({ id: userA });
		const user2 = await this.userRepo.findOneBy({ id: userB });
		if (user1 && user2) {
			gameInfo.userA = userA;
			gameInfo.userB = userB;
			gameInfo.type = post.type;
			return await this.gameInfoRepo.save(gameInfo);
		} else throw new ForbiddenException("User not found");
	}

	async returnAll() {
		return await this.gameInfoRepo.find();
	}

	async returnOne(gameId: number) {
		const tmp = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (tmp) return await this.gameInfoRepo.findOneBy({ id: gameId });
		else throw new ForbiddenException("GameInfo not found");
	}

	async update(gameId: number, post: GameInfoPost) {
		const tmp = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (tmp) return await this.gameInfoRepo.update(gameId, post);
		else throw new ForbiddenException("GameInfo not found");
	}

	async delete(gameId: number) {
		const tmp = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (tmp) return await this.gameInfoRepo.delete(tmp);
		else throw new ForbiddenException("GameInfo not found");
	}
}
