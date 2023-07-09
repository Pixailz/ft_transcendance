import { IsNotEmpty, IsEmail, IsString, IsOptional } from "class-validator";

export class UserInfoPost {
	@IsString()
	@IsNotEmpty()
	nickname?: string;

	@IsString()
	@IsNotEmpty()
	name?: string;

	@IsEmail()
	@IsNotEmpty()
	email?: string;

	@IsString()
	@IsOptional()
	picture?: string;
}
