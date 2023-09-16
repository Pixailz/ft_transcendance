import { IsNotEmpty, IsNumber } from "class-validator";

export class DBBlockedPost {
	@IsNotEmpty()
	@IsNumber()
	meId?: number;
	@IsNotEmpty()
	@IsNumber()
	targetId?: number;
}
