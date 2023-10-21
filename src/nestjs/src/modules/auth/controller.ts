import { Controller, Get, Request, Query } from "@nestjs/common";
import { AuthService } from "./service";
import { Public } from "../../decorators/public";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}


	@Public()
	@Get("ft_callback")
	async login(@Query("code") code: string) {
		return this.authService.ftSignIn(code);
	}

	@Public()
	@Get("ext_login")
	async login_ext(
		@Query("nickname") nickname: string,
		@Query("pass") pass: string,
	) {
		return this.authService.extSignIn(nickname, pass);
	}

	@Public()
	@Get("ext_register")
	async register_ext(
		@Query("nickname") nickname: string,
		@Query("pass") pass: string,
	) {
		return this.authService.extRegister(nickname, pass);
	}

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
