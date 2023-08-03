import { IsString, IsNotEmpty } from "class-validator";

export class GameInfoPost {
	@IsNotEmpty()
	@IsString()
	type?: string;
}
