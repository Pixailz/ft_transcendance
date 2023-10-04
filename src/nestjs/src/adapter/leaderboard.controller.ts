import { Controller, Get } from "@nestjs/common";
import { DBGameInfoService } from "src/modules/database/game/gameInfo/service";
import { DBPlayerScoreService } from "src/modules/database/game/player-score/service";
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
		private scores: DBPlayerScoreService,
	) {}

	@Get()
	async getLeaderboard(): Promise<LeaderBoardEntry[]> {
		const users = await this.userService.returnAll();
		const games = await this.scores.returnAll();

		if (games.length === 0)
			return [{ nickname: "No users", score: 69420, rank: 1 }];
		let leaderboard = [];
		for (const user of users) {
			const scores = await this.scores.find({
				where: { playerId: user.id },
			});
			let score = 0;
			for (const s of scores) {
				score += s.score;
			}
			leaderboard.push({ nickname: user.nickname, score });
		}
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
