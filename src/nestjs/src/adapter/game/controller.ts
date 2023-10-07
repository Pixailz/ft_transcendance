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
import { DBPlayerScoreService } from "src/modules/database/game/player-score/service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("game")
export class GameController {
	constructor(
		private gameService: DBGameInfoService,
		private scoresService: DBPlayerScoreService,
	) {}

	@Get("user-stats/:id")
	async getUserStats(@Param("id") userId: number): Promise<any> {
		const userStats = await this.scoresService.getUserStats(userId);
		return userStats;
	}
}
