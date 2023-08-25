import { IsNotEmpty, IsNumber } from "class-validator";

export class DBFriendPost {
	@IsNotEmpty()
	@IsNumber()
	friendId?: number;
}
