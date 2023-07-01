import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { api42OAuthModule } from "./api42OAuth/api42OAuth.module"

@Module({
	imports: [api42OAuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
