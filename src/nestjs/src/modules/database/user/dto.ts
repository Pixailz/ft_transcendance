import { IsNotEmpty, IsOptional, IsEmail, IsString } from "class-validator";

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

	// @IsOptional()
	// @IsBooleanString()
	// twoAuthFactor?: boolean
}
