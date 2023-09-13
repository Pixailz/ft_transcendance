import {
	IsNotEmpty,
	IsOptional,
	IsEmail,
	IsString,
	IsBoolean,
	MinLength,
} from "class-validator";

export class DBUserPost {
	@IsNotEmpty()
	@IsString()
	@MinLength(4, { message: "minimum len for login is 4" })
	ftLogin?: string;
}

export class DBUserInfoPost {
	@IsOptional()
	@IsString()
	@MinLength(3, { message: "minimum len for nickname is 3" })
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

	@IsOptional()
	@IsString()
	twoAuthFactorSecret?: string;
}
