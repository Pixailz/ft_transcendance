import {
	Controller,
	Get,
	Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
