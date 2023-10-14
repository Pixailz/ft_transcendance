import { Injectable, NotFoundException } from "@nestjs/common";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
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

	async returnAll(): Promise<PlayerScoreEntity[]> {
		return await this.playerScoreRepo.find();
	}

	async find(parameters: FindManyOptions<PlayerScoreEntity>) {
		return await this.playerScoreRepo.find(parameters);
	}

	async findOne(parameters: FindOneOptions<PlayerScoreEntity>) {
		return await this.playerScoreRepo.findOne(parameters);
	}

	async update(gameId: number, post: DBPlayerScorePost) {
		const gameInfo = await this.gameInfoRepo.findOne({
			where: { id: gameId },
			relations: ["playersScores"],
		});
		const playerScore = gameInfo.playersScores.find(
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

	async getUserStats(userId: number): Promise<any> {
		const user = await this.userRepo.findOne({
			where: { id: userId },
			relations: [
				"gameInfos",
				"gameInfos.playersScores",
				"gameInfos.usersArray",
			],
		});
		if (!user) {
			throw new NotFoundException("User not found");
		}
		console.log(user);
		const gameInfos = user.gameInfos;
		const userStats = [];
		gameInfos.forEach((gameInfo) => {
			const playerScore = gameInfo.playersScores.find(
				(element) => element.playerId == userId,
			);
			const score = playerScore.score;
			const opponent = gameInfo.usersArray.filter(
				(element) => element.id != userId,
			)[0];
			const opponentScore = gameInfo.playersScores.find(
				(element) => element.playerId != userId,
			).score;
			const createdAt = gameInfo.createdAt;
			const result =
				score > opponentScore
					? "win"
					: score < opponentScore
					? "lose"
					: "draw";
			userStats.push({
				id: gameInfo.id,
				opponent: opponent,
				score: score,
				opponentScore: opponentScore,
				createdAt: createdAt,
				result: result,
			});
		});
		return userStats.sort((a, b) => b.createdAt - a.createdAt);
	}
}
