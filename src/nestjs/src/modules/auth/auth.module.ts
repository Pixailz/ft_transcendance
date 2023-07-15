import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { Api42Module } from "../api42/api42.module";
import { DbModule } from "../database/database.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1d" },
		}),
		Api42Module,
		DbModule,
		PassportModule.register({ defaultStrategy: "jwt" }),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
