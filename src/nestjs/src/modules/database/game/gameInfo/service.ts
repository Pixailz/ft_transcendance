import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
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
		gameInfo.type = post.type;
		const users = await this.userRepo.find({
			where: { id: In(post.users) },
		});
		gameInfo.usersArray = users;
		gameInfo.users = post.users;

		const playerScores = [];
		for (const user of post.users) {
			const tmp = await this.userRepo.findOneBy({ id: user });
			if (!tmp) throw new NotFoundException("User not found");

			const playerScore = new PlayerScoreEntity();
			playerScore.playerId = tmp.id;
			playerScore.score = 0;
			playerScores.push(playerScore);
		}

		gameInfo.playersScores = playerScores;
		console.log(gameInfo);
		return await this.gameInfoRepo.save(gameInfo);
	}

	async returnAll() {
		return await this.gameInfoRepo.find();
	}

	async returnOne(gameId: number) {
		const tmp = await this.gameInfoRepo.findOne({
			where: { id: gameId },
			relations: ["playersScores", "usersArray"],
		});
		if (tmp) return tmp;
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
}
