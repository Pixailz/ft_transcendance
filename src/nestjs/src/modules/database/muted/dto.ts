import { IsNotEmpty, IsNumber } from "class-validator";

export class DBMutedPost {
	@IsNotEmpty()
	@IsNumber()
	blockedId?: number;
}
