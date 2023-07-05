import { Controller, Get, Query } from "@nestjs/common";

import { Api42OAuthService } from "./api42OAuth.service";

@Controller("auth")
export class Api42OAuthController {
	constructor(private api42OAuthService: Api42OAuthService) {}

	@Get()
	async getUser(@Query() query: { code: string }) {
		const user_token = await this.api42OAuthService.getToken(query.code);
		const [user_id, user_login] = await this.api42OAuthService.getUserId(
			user_token,
		);
		console.log("user_id    " + user_id);
		console.log("user_login " + user_login);
	}
}
