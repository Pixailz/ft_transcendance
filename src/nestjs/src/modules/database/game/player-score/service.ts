import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PlayerScoreEntity } from "./entity";
import { DBPlayerScorePost } from "./dto";

import { UserEntity } from "../../user/entity";
import { GameInfoEntity } from "../gameInfo/entity";

@Injectable()
export class DBPlayerScoreService {
	constructor(
		@InjectRepository(PlayerScoreEntity)
		private readonly playerScoreRepo: Repository<PlayerScoreEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		@InjectRepository(GameInfoEntity)
		private readonly gameInfoRepo: Repository<GameInfoEntity>,
	) {}

	async create(post: DBPlayerScorePost) {
		const gameInfo = await this.gameInfoRepo.findOneBy({ id: post.gameId });
		gameInfo.playerScores.forEach((element) => {
			if (element.playerId == post.playerId)
				throw new ForbiddenException("Player Score already exists");
		});
		const playerScore = new PlayerScoreEntity();
		playerScore.playerId = post.playerId;
		playerScore.score = post.score;
		playerScore.gameInfo = gameInfo;
		gameInfo.playerScores.push(playerScore);
		await this.gameInfoRepo.save(gameInfo);
		return await this.playerScoreRepo.save(playerScore);
	}

	async returnAll() {
		return await this.playerScoreRepo.find();
	}

	async returnOne(gameId: number) {
		const tmp = await this.playerScoreRepo.findOneBy({ id: gameId });
		if (tmp) return await this.playerScoreRepo.findOneBy({ id: gameId });
		else throw new NotFoundException("GameInfo not found");
	}

	async update(gameId: number, post: DBPlayerScorePost) {
		const gameInfo = await this.gameInfoRepo.findOneBy({ id: gameId });
		const playerScore = gameInfo.playerScores.find(
			(element) => element.playerId == post.playerId,
		);
		if (playerScore) {
			playerScore.score = post.score;
			await this.playerScoreRepo.save(playerScore);
			return playerScore;
		} else {
			throw new NotFoundException("Player Score not found");
		}
	}

	async delete(gameId: number) {
		const tmp = await this.playerScoreRepo.findOneBy({ id: gameId });
		if (tmp) return await this.playerScoreRepo.delete({ id: gameId });
		else throw new NotFoundException("GameInfo not found");
	}
}
