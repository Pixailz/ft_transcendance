import { Module } from "@nestjs/common";

import { Api42OAuthController } from "./api42OAuth.controller";
import { Api42OAuthService } from "./api42OAuth.service";

@Module({
	imports: [],
	controllers: [Api42OAuthController],
	providers: [Api42OAuthService],
})
export class api42OAuthModule {}
