import { IsNotEmpty, IsOptional, MaxLength} from "class-validator";

export class DBChatRoomTypePost {
	@IsNotEmpty()
	type?: number;
}

export class DBChatRoomPost {
	@IsNotEmpty()
	@MaxLength(120, {message: "Max len for room name 120"})
	name?: string;

	@IsOptional()
	password?: string;
}
