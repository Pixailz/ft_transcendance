import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { api42OAuthModule } from './api42OAuth/api42OAuth.module';

@Module({
	imports: [
		api42OAuthModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
