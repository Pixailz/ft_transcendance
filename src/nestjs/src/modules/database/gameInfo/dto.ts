import { IsString, IsNotEmpty } from "class-validator";

export class DBGameInfoPost {
	@IsNotEmpty()
	@IsString()
	type?: string;
}
