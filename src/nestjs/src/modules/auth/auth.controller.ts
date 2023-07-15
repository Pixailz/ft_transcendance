import {
	Body,
	Controller,
	Get,
	Post,
	HttpCode,
	HttpStatus,
	UseGuards,
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
