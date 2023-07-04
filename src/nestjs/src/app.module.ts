import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { api42OAuthModule } from "./api42OAuth/api42OAuth.module"
import { DbModule } from './db/db.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		api42OAuthModule,
		DbModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
