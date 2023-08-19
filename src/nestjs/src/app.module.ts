import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { DBModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { WSChatModule } from "./websocket/chat/chat.module";
import { UserModule } from "./adapter/user/module";
import { ChatRoomModule } from "./adapter/chatRoom/module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DBModule,
		AuthModule,
		WSChatModule,
		UserModule,
		ChatRoomModule,
	],
	controllers: [],
	// controller
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
