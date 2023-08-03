import { IsInt, IsNotEmpty } from "class-validator";

export class MessagePost {
	@IsNotEmpty()
	content?: string;
}
