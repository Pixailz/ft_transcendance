import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { dbUserService } from "../database/user/service";

import { Request } from "@nestjs/common";

@Injectable()
export class userService {
	constructor (private jwtService: JwtService, private DbUserService: dbUserService) {}

	async get_user_info(@Request() req)
	{
		const jwt_token = req.get('Authorization').replace('Bearer', '').trim();
		const user_id = this.jwtService.decode(jwt_token).sub;
		const user_info = await this.DbUserService.get_user(user_id, null);
		return user_info;
	}
}
