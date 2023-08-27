import { IsNotEmpty, IsOptional } from "class-validator";

export class DBChatRoomPost {
	@IsNotEmpty()
	name?: string;

	@IsOptional()
	type?: number;

	@IsOptional()
	password?: string;
}
