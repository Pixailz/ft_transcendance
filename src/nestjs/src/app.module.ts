import { Module } from "@nestjs/common";

import { api42OAuthModule } from "./modules/api42OAuth/module";

@Module({
	imports: [api42OAuthModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
