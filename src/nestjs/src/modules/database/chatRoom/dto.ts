import { IsNotEmpty, IsOptional } from "class-validator";

export class DBChatRoomTypePost {
	 @IsNotEmpty()
	 type?: number;
}

export class DBChatRoomPost {
	@IsNotEmpty()
	name?: string;

	@IsOptional()
	password?: string;
}
