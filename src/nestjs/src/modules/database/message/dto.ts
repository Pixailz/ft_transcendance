import { IsNotEmpty } from "class-validator";
import { MessageContentEntity } from "../messageContent/entity";

export class DBMessagePost {
	@IsNotEmpty()
	message: MessageContentEntity[];
}
