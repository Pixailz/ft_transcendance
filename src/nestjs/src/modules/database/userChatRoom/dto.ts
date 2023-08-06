import { IsBooleanString, IsNotEmpty, IsOptional } from "class-validator";

export class DBUserChatRoomPost {
	@IsNotEmpty()
	@IsBooleanString()
	isOwner?: boolean;
	@IsOptional()
	@IsBooleanString()
	isAdmin?: boolean;
}
