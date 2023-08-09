import { Controller, Get, Request, Query } from "@nestjs/common";
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

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
