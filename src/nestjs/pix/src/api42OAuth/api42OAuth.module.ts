import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { Api42OAuthController } from "./api42OAuth.controller";
import { Api42OAuthService } from "./api42OAuth.service";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
	],
	controllers: [Api42OAuthController],
	providers: [Api42OAuthService],
})
export class api42OAuthModule {}
