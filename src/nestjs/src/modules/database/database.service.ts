import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { from, Observable } from "rxjs";

import { UserEntity } from "./user.entity";
import { UserPost } from "./database.controller";

@Injectable()
export class DbService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>
	) {}

	createUser(userPost: UserPost): Observable<UserPost> {
		console.log("db_user " + process.env.DB_USER);
		console.log("db_pass " + process.env.DB_PASS);
		console.log("db_name " + process.env.DB_NAME);
		return from(this.userRepo.save(userPost));
	}
}
