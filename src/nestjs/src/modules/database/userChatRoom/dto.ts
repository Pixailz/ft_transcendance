import { IsBooleanString, IsNotEmpty, IsOptional } from "class-validator";
import { Timestamp } from "typeorm";

export class MutePost {
	@IsNotEmpty()
	@IsBooleanString()
	isMute: boolean;
	@IsOptional()
	mutedTime?: Timestamp;
}

export class DBUserChatRoomPost {
	@IsNotEmpty()
	@IsBooleanString()
	isOwner?: boolean;
	@IsOptional()
	@IsBooleanString()
	isAdmin?: boolean;
}
