import { IsNotEmpty, IsNumber } from "class-validator";

export class DBBlockedPost {
	@IsNotEmpty()
	@IsNumber()
	blockedId?: number;
}
