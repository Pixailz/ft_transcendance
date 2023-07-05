import { Body, Controller, Post } from "@nestjs/common";
import { DbService } from "./database.service";
import { Observable } from "rxjs";

export interface UserPost {
	name?: string;
	email?: string;
	isDeleted?: boolean;
}

@Controller("db")
export class DbController {
	constructor (private readonly dbService: DbService) {};

	@Post()
	create(@Body() post: UserPost): Observable<UserPost> {
		return this.dbService.createUser(post);
	}
}
