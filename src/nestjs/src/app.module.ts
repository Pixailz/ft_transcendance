import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { api42OAuthModule } from "src/api42OAuth/api42OAuth.module";
import { DbModule} from "src/db/db.module";

@Module({
	imports: [
		api42OAuthModule,
		DbModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
