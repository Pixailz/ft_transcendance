import {
	Controller,
	Get,
	Request,
	Query
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/public.decorator";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get("ft_callback")
	async login(@Query("code") code: string) {
		return this.authService.signIn(code);
	}

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
