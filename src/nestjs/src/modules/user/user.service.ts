import { Injectable, Request } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { dbUserService } from "../database/user/service";

@Injectable()
export class userService {
	constructor (private jwtService: JwtService, private DbUserService: dbUserService) {}

	async get_user_id(@Request() req)
	{
		const jwt_token = req.get('Authorization').replace('Bearer', '').trim();
		return (this.jwtService.decode(jwt_token).sub);
	}

	async get_user_info(@Request() req)
	{
		const user_id = await this.get_user_id(req);
		const user_info = await this.DbUserService.get_user(user_id, null);
		return user_info;
	}
}
