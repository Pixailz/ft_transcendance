import { Controller, Get } from "@nestjs/common";
import { DBUserService } from "src/modules/database/user/service";

export interface LeaderBoardEntry {
	rank?: number;
	nickname: string;
	elo: number;
}

@Controller("leaderboard")
export class LeaderboardController {
	constructor(private userService: DBUserService) {}

	@Get()
	async getLeaderboard(): Promise<LeaderBoardEntry[]> {
		const users = await this.userService.returnAll();
		users.sort((a, b) => b.elo - a.elo);
		const leaderboard = users.map((user, index) => {
			return {
				rank: index + 1,
				nickname: user.nickname,
				elo: user.elo,
			};
		});
		return leaderboard;
	}
}
