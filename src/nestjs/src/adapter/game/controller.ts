import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Put,
	Request,
	UseInterceptors,
} from "@nestjs/common";
import { DBGameInfoService } from "src/modules/database/game/gameInfo/service";
import { DBPlayerScoreService } from "src/modules/database/game/playerScore/service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("game")
export class GameController {
	constructor(
		private gameService: DBGameInfoService,
		private scoresService: DBPlayerScoreService,
	) {}

	@Get("stats/:id")
	async getUserGameStats(@Param("id") userId: number): Promise<any> {
		const userStats = await this.scoresService.getUserGameStats(userId);
		return userStats;
	}

	@Get("history/:id")
	async getGamesHistory(@Param("id") userId: number): Promise<any> {
		const games = await this.scoresService.getGamesHistory(userId);
		return games;
	}
}
