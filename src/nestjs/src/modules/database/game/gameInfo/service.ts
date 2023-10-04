import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GameInfoEntity } from "./entity";
import { DBGameInfoPost } from "./dto";

import { UserEntity } from "../../user/entity";
import { PlayerScoreEntity } from "../player-score/entity";

@Injectable()
export class DBGameInfoService {
	constructor(
		@InjectRepository(GameInfoEntity)
		private readonly gameInfoRepo: Repository<GameInfoEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: DBGameInfoPost) {
		const gameInfo = new GameInfoEntity();
		for (const user of post.users) {
			const tmp = await this.userRepo.findOneBy({ id: user });
			if (!tmp) throw new NotFoundException("User not found");
		}
		gameInfo.type = post.type;
		gameInfo.users = post.users;
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
		if (tmp) return await this.gameInfoRepo.delete({ id: gameId });
		else throw new NotFoundException("GameInfo not found");
	}

	//Scores Updates
	async updateScore(gameId: number, post: PlayerScoreEntity) {
		const game = await this.gameInfoRepo.findOneBy({ id: gameId });
		if (game) {
			const playerScore = new PlayerScoreEntity();
			playerScore.playerId = post.playerId;
			playerScore.score = post.score;
			playerScore.gameInfo = game;
			return await this.gameInfoRepo.save(playerScore);
		} else throw new NotFoundException("GameInfo not found");
	}
}
