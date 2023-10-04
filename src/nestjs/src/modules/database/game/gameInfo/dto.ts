import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { isUint8Array } from "util/types";

export class DBGameInfoPost {
	@IsNotEmpty()
	@IsString()
	type?: string;

	@IsNotEmpty()
	@IsArray()
	users?: number[];
}
