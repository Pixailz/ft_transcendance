import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { api42OAuthModule } from './modules/api42OAuth/api42OAuth.module';
import { DbModule } from './modules/database/database.module';
import { DbController } from './modules/database/database.controller';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		api42OAuthModule,
		DbModule
	],
	controllers: [
		DbController
	],
	providers: [],
})
export class AppModule {}
