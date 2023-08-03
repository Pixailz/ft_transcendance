import { IsNotEmpty, IsOptional, IsEmail, IsString, IsBooleanString} from "class-validator";
import { isBooleanObject } from "util/types";

export class UserPost {
	@IsNotEmpty()
	@IsString()
	ftLogin?: string;
}

export class UserInfoPost {
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