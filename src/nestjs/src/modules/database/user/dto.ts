import { IsNotEmpty, IsOptional, IsEmail, IsString} from "class-validator";

export class UserPost {
	@IsString()
	ftLogin?: string;
}

export class UserInfoPost {
	@IsString()
	nickname?: string;

	@IsEmail()
	email?: string;
	
	@IsOptional()
	picture?: string;
}