import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./user/entity";
import { ChatRoomEntity } from "./chatRoom/entity";
import { UserChatRoomEntity } from "./userChatRoom/entity";
import { MessageEntity } from "./message/entity";
import { GameInfoEntity } from "./game/gameInfo/entity";
import { FriendEntity } from "./friend/entity";
import { FriendRequestEntity } from "./friendRequest/entity";
import { BlockedEntity } from "./blocked/entity";
import { NotificationEntity } from "./notification/entity";

import { DBUserService } from "./user/service";
import { DBChatRoomService } from "./chatRoom/service";
import { DBUserChatRoomService } from "./userChatRoom/service";
import { DBMessageService } from "./message/service";
import { DBGameInfoService } from "./game/gameInfo/service";
import { DBFriendService } from "./friend/service";
import { DBFriendRequestService } from "./friendRequest/service";
import { DBBlockedService } from "./blocked/service";
import { DBNotificationService } from "./notification/service";

import { DBUserController } from "./user/controller";
import { DBChatRoomController } from "./chatRoom/controller";
import { DBUserChatRoomController } from "./userChatRoom/controller";
import { DBMessageController } from "./message/controller";
import { DBGameInfoController } from "./game/gameInfo/controller";
import { DBFriendController } from "./friend/controller";
import { DBFriendRequestController } from "./friendRequest/controller";
import { Sanitize } from "./sanitize-object";
import { DBBlockedController } from "./blocked/controller";
import { DBNotificationController } from "./notification/controller";
import { PlayerScoreEntity } from "./game/playerScore/entity";
import { DBPlayerScoreService } from "./game/playerScore/service";
import { Elo } from "./elo";
import { AchievementEntity, UserAchievementEntity } from "./achievements/entity";
import { AchievementService } from "./achievements/service";
import { UserMetricsEntity } from "./metrics/entity";
import { UserMetricsService } from "./metrics/service";
import { WSModule } from "../../websocket/module";

@Module({
	imports: [
		forwardRef(() => WSModule),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "postgresql",
			port: 5432,
			username: process.env.DB_USER.toString(),
			password: process.env.DB_PASS.toString(),
			database: process.env.DB_NAME.toString(),
			entities: [
				UserEntity,
				ChatRoomEntity,
				UserChatRoomEntity,
				MessageEntity,
				GameInfoEntity,
				PlayerScoreEntity,
				FriendEntity,
				FriendRequestEntity,
				BlockedEntity,
				NotificationEntity,
				AchievementEntity,
				UserAchievementEntity,
				UserMetricsEntity,
			],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([
			UserEntity,
			ChatRoomEntity,
			UserChatRoomEntity,
			MessageEntity,
			GameInfoEntity,
			PlayerScoreEntity,
			FriendEntity,
			FriendRequestEntity,
			BlockedEntity,
			NotificationEntity,
			AchievementEntity,
			UserAchievementEntity,
			UserMetricsEntity,
		]),
	],
	controllers: [
		DBUserController,
		DBChatRoomController,
		DBUserChatRoomController,
		DBMessageController,
		DBGameInfoController,
		DBFriendController,
		DBFriendRequestController,
		DBBlockedController,
		DBNotificationController,
	],
	providers: [
		Sanitize,
		DBUserService,
		DBChatRoomService,
		DBUserChatRoomService,
		DBMessageService,
		DBGameInfoService,
		DBPlayerScoreService,
		DBFriendService,
		DBFriendRequestService,
		DBBlockedService,
		DBNotificationService,
		AchievementService,
		UserMetricsService,
		Elo,
	],
	exports: [
		DBUserService,
		DBChatRoomService,
		DBUserChatRoomService,
		DBMessageService,
		DBGameInfoService,
		DBPlayerScoreService,
		DBFriendService,
		DBFriendRequestService,
		DBBlockedService,
		DBNotificationService,
		AchievementService,
		UserMetricsService,
		Elo,
	],
})
export class DBModule {}
