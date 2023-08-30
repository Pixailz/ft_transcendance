import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Public } from "src/public.decorator";
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
}
