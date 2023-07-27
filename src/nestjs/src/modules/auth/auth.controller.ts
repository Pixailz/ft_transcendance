import { Controller, Get, Request, Query, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { Public } from "src/public.decorator";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get("ft_callback")
	async login(@Query("code") code: string) {
		return this.authService.ftSignIn(code);
	}

	@Public()
	@Get("ft_verify")
	async canActivate(@Query("access_token") access_token: string) {
		if (!await this.authService.verifyToken(access_token))
			throw new UnauthorizedException();

		return {status: "oke"};
	}

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
