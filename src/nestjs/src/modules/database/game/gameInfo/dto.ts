import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";
import { PlayerScoreEntity } from "../playerScore/entity";

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
