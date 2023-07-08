import { Module } from "@nestjs/common";

import { Api42OAuthController } from "./controller";
import { Api42OAuthService } from "./service";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: "2h",
			},
		}),
	],
	controllers: [Api42OAuthController],
	providers: [Api42OAuthService],
})
export class api42OAuthModule {}
