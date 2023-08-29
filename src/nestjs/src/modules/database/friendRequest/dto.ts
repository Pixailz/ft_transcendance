import { IsNotEmpty, IsNumber } from "class-validator";

export class DBFriendRequestPost {
	@IsNotEmpty()
	@IsNumber()
	friendId?: number;
}
