import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";
import { PlayerScoreEntity } from "../player-score/entity";

export class DBGameInfoPost {
	@IsNotEmpty()
	@IsString()
	type?: string;

	@IsNotEmpty()
	@IsArray()
	users?: number[];

	@IsOptional()
	playersScores?: PlayerScoreEntity[];
}
