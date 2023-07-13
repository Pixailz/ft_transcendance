import { Controller, Get, Query, Res, Req, HttpStatus } from "@nestjs/common";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";

import { Api42OAuthService } from "./service";

@Controller("auth")
export class Api42OAuthController {
	constructor(
		private api42OAuthService: Api42OAuthService,
		private jwtService: JwtService,
	) {}

	@Get()
	async login(
		@Query() query: { code: string },
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		console.log("code: " + query.code);
		if (req.cookies.access_token) {
			console.log("JWT found");
			const user_id = await this.api42OAuthService.getTokenJwt(
				req.cookies.access_token,
			);
			console.log("user_id: " + user_id);
		} else {
			console.log("JWT not found");
			const user_token = await this.api42OAuthService.getTokenApi(
				query.code,
			);
			const user_id = await this.api42OAuthService.getUserId(user_token);
			console.log("user_id: " + user_id);
			const payload = await this.jwtService.signAsync({ ft_id: user_id });
			res.cookie("access_token", payload, {
				secure: false,
				expires: new Date(Date.now() + 7200 * 1000),
			});
		}
		return { status: "ok" };
	}
	@Get("verify")
	async verify(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const user_id = await this.api42OAuthService.getTokenJwt(
			req.cookies.access_token,
		);
		if (user_id) return { status: "ok" };
		res.status(HttpStatus.UNAUTHORIZED).send();
	}
}