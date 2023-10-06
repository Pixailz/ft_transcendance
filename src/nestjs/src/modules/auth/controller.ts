import { Controller, Get, Request, Query, Body } from "@nestjs/common";
import { AuthService } from "./service";
import { Public } from "src/decorators/public";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}


	@Public()
	@Get("ft_callback")
	async login(@Query("code") code: string) {
		if (!Number(process.env.PRODUCTION) && code === "test")
			return this.authService.ftSignInTest(0);
		else return this.authService.ftSignIn(code);
	}

	@Public()
	@Get("ft_callback_ext")
	async login_ext(
		@Query("nickname") nickname: string,
		@Query("pass") pass: string
	)
	{ return this.authService.ftSignInExt(nickname, pass); }

	@Public()
	@Get("ft_register_ext")
	async register_ext(
		@Query("nickname") nickname: string,
		@Query("pass") pass: string
	)
	{ return this.authService.ftRegisterExt(nickname, pass); }

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
