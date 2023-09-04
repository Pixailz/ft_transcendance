import { Controller, Get } from "@nestjs/common";
import { DBGameInfoService } from "src/modules/database/gameInfo/service";
import { DBUserService } from "src/modules/database/user/service";

export interface LeaderBoardEntry {
	rank?: number;
	nickname: string;
	score: number;
}

@Controller("leaderboard")
export class LeaderboardController {
	constructor(
		private userService: DBUserService,
		private games: DBGameInfoService,
	) {}

	@Get()
	async getLeaderboard(): Promise<LeaderBoardEntry[]> {
		const users = await this.userService.returnAll();
		const games = await this.games.returnAll();

		if (games.length === 0)
			return [{ nickname: "No users", score: 69420, rank: 1 }];
		let leaderboard = users.map((user) => {
			const userGames = games.filter(
				(game) => game.userA === user.id || game.userB === user.id,
			);
			const score = userGames.reduce((acc, game) => {
				if (game.userA === user.id) {
					acc.scoreA += game.scoreA;
				} else {
					acc.scoreA += game.scoreB;
				}
				return acc;
			});
			return {
				nickname: user.nickname,
				score: score.scoreA,
			};
		});

		leaderboard = leaderboard.sort((a, b) => b.score - a.score);
		leaderboard = leaderboard.map((entry, index) => {
			return {
				...entry,
				rank: index + 1,
			};
		});

		return leaderboard;
	}
}
