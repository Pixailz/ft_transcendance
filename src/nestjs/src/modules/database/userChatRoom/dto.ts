import {
	IsBooleanString,
	IsDate,
	IsNotEmpty,
	IsOptional,
} from "class-validator";
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
	@IsOptional()
	@IsBooleanString()
	isBanned?: boolean;
	@IsOptional()
	@IsBooleanString()
	isMuted?: boolean;
	@IsOptional()
	@IsDate()
	demuteDate?: Date;
}
