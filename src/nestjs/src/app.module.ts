import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { DBModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/module";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { WSModule } from "./websocket/ws.module";
import { UserModule } from "./adapter/user/module";
import { ChatRoomModule } from "./adapter/chatRoom/module";
import { TwofaModule } from "./modules/twofa/twofa.module";
import { ErrorLogController } from "./adapter/errorlog.controller";
import { LeaderboardController } from "./adapter/leaderboard.controller";
import { ColyseusService } from "./addons/colyseus";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DBModule,
		AuthModule,
		UserModule,
		ChatRoomModule,
		WSModule,
		TwofaModule,
	],
	controllers: [ErrorLogController, LeaderboardController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		ColyseusService,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(monitor()).forRoutes("/monitor");
	}
}
