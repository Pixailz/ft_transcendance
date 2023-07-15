import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { AppController } from "./app.controller";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, AuthModule],
	controllers: [AppController],
	// controller
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
