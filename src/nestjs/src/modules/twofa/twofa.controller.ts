import { Controller, Get, Param, Post, Request } from "@nestjs/common";
import { Public } from "src/decorators/public";
import { TwofaService } from "./twofa.service";

@Controller("2fa")
export class TwofaController {
	constructor(private twofaService: TwofaService) {}

	@Public()
	@Post("verify/:nonce/:code")
	async verifyCode(@Param() params: any) {
		return this.twofaService.verifyCode(params.nonce, params.code);
	}

	@Get("setup/:nonce")
	async setup(@Param() params: any) {
		return this.twofaService.setup(params.nonce);
	}

	@Post("setup/:nonce/:code")
	async verifySetup(@Param() params: any) {
		return this.twofaService.verifySetup(params.nonce, params.code);
	}

	@Post("disable")
	async disable(@Request() req) {
		return this.twofaService.disable(req.user.user_id);
	}
}
