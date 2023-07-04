import { Body, Controller, Post } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { Observable } from "rxjs";

import { UserPost } from "./db.interface";

@Controller("db")
export class DbController {
	constructor (private readonly dbService: DbService) {};

	@Post()
	create(@Body() post: UserPost): Observable<UserPost> {
		return this.dbService.createUser(post);
	}
}
