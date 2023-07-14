import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./modules/database/database.module";
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DbModule,
		AuthModule,
	],
	controllers: [],
	// controller
	providers: [],
})
export class AppModule {}
