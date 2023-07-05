import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { DbModule } from './modules/database/database.module';
import { DbController } from './modules/database/database.controller';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DbModule
	],
	controllers: [
		DbController
	],
	// controller
	providers: [],
})
export class AppModule {}
