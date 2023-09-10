import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GameInfoEntity } from "./entity";
import { DBGameInfoPost } from "./dto";

import { UserEntity } from "../user/entity";

@Injectable()
export class DBGameInfoService {
	constructor(
		@InjectRepository(GameInfoEntity)
		private readonly gameInfoRepo: Repository<GameInfoEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: DBGameInfoPost, userA: number, userB: number) {
		const gameInfo = new GameInfoEntity();
		const user1 = await this.userRepo.findOneBy({ id: userA });
		const user2 = await this.userRepo.findOneBy({ id: userB });
		if (!user1 || !user2) throw new NotFoundException("User not found");
		gameInfo.userA = userA;
		gameInfo.userB = userB;
		gameInfo.type = post.type;
		return await this.gameInfoRepo.save(gameInfo);
	}

	async returnAll() {
		return await this.gameInfoRepo.find();
	}

	async returnOne(gameId: number) {
		const tmp = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (tmp) return await this.gameInfoRepo.findOneBy({ id: gameId });
		else throw new NotFoundException("GameInfo not found");
	}

	async update(gameId: number, post: DBGameInfoPost) {
		const tmp = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (tmp) return await this.gameInfoRepo.update(gameId, post);
		else throw new NotFoundException("GameInfo not found");
	}

	async delete(gameId: number) {
		const tmp = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (tmp) return await this.gameInfoRepo.delete(tmp);
		else throw new NotFoundException("GameInfo not found");
	}
}
