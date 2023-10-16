import { IsNotEmpty } from "class-validator";
import { MessageContentType } from "./entity";

export class DBMessageContentPost {
	@IsNotEmpty()
	type?: MessageContentType
	@IsNotEmpty()
	content?: string;
}
