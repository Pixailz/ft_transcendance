import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { DBModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { WSModule } from "./websocket/ws.module";
import { UserModule } from "./adapter/user/module";
import { ChatRoomModule } from "./adapter/chatRoom/module";
import { TwofaModule } from "./modules/twofa/twofa.module";
import { ErrorLogController } from "./adapter/errorlog.controller";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DBModule,
		AuthModule,
		WSModule,
		UserModule,
		ChatRoomModule,
		TwofaModule
	],
	controllers: [ErrorLogController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
