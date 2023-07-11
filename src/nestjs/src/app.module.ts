import { Module } from "@nestjs/common";
import { api42OAuthModule } from "./modules/api42OAuth/module";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./modules/database/database.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		api42OAuthModule,
		DbModule,
	],
	controllers: [],
	// controller
	providers: [],
})
export class AppModule {}
