import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";

import { AuthController } from "./controller";
import { AuthService } from "./service";
import { Api42Module } from "../api42/module";
import { DBModule } from "../database/database.module";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1d" },
		}),
		Api42Module,
		DBModule,
		PassportModule.register({ defaultStrategy: "jwt" }),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
