import {
	Controller,
	Get,
	Query,
	Res,
	Req
} from "@nestjs/common";

import { Response, Request } from "express";

import { Api42OAuthService } from "./api42OAuth.service";

@Controller("auth")
export class Api42OAuthController {
	constructor(private api42OAuthService: Api42OAuthService) { }

	@Get("login")
	async login(
			@Query() query: { code: string },
			@Req() req: Request,
			@Res() res: Response
		) {
		console.log("query.code: " + query.code);
		console.log("req: " + req);
		const user_token = await this.api42OAuthService.getToken(
			query.code,
			req,
			res
		);
		console.log("Token:      " + user_token);
		const [user_id, user_login] = await this.api42OAuthService.getUserId(
			user_token,
		);
		console.log("User ID:    " + user_id);
		console.log("User Login: " + user_login);

		res.send({status: "ok"});
	}
}
