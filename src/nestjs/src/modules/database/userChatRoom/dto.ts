import { IsBooleanString, IsNotEmpty, IsOptional } from "class-validator";

export class UserChatRoomPost {
	@IsNotEmpty()
	@IsBooleanString()
	isOwner?: boolean;
	@IsOptional()
	@IsBooleanString()
	isAdmin?: boolean;
}
