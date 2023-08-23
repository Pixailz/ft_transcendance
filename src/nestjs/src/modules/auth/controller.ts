import { Controller, Get, Request, Query, Post, Body } from "@nestjs/common";
import { AuthService } from "./service";
import { Public } from "src/public.decorator";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get("ft_callback")
	async login(@Query("code") code: string) {
		if (!Number(process.env.PRODUCTION) && code === "test")
			return this.authService.ftSignInTest();
		else return this.authService.ftSignIn(code);
	}

	@Public()
	@Post("2fa")
	async twoFa(@Body() body: any) {
		return this.authService.twoFa(body.nonce, body.code);
	}

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
