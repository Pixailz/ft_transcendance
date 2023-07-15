import {
	Controller,
	Get,
	Request,
	Post,
	UseGuards,
	Query,
} from "@nestjs/common";
import { AuthService } from "./modules/auth/auth.service";
import { Public } from "./public.decorator";

@Controller()
export class AppController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get("auth/ft_callback")
	async login(@Query("code") code: string) {
		return this.authService.signIn(code);
	}
}
