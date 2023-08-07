import { IsNotEmpty } from "class-validator";

export class DBMessagePost {
	@IsNotEmpty()
	content?: string;
}
