import { IsInt, IsNotEmpty } from "class-validator";

export class UserPost {
	@IsNotEmpty()
	ftLogin?: string;
}
