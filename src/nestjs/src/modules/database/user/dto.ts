import {
	IsNotEmpty,
	IsOptional,
	IsEmail,
	IsString,
	IsBoolean,
} from "class-validator";

export class DBUserPost {
	@IsNotEmpty()
	@IsString()
	ftLogin?: string;
}

export class DBUserInfoPost {
	@IsNotEmpty()
	@IsString()
	nickname?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	picture?: string;

	@IsOptional()
	status?: number;

	@IsOptional()
	lastSeen?: Date;

	@IsOptional()
	@IsBoolean()
	twoAuthFactor?: boolean;
}
