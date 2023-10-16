import { IsNotEmpty, IsNumberString } from "class-validator";

export class DBPlayerScorePost {
	@IsNotEmpty()
	@IsNumberString()
	gameId?: number;

	@IsNotEmpty()
	@IsNumberString()
	playerId?: number;

	@IsNotEmpty()
	@IsNumberString()
	score?: number;
}
