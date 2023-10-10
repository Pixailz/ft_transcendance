import { Module } from "@nestjs/common";
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
import { MessageContentEntity } from "./messageContent/entity";
import { PlayerScoreEntity } from "./game/player-score/entity";

import { DBUserService } from "./user/service";
import { DBChatRoomService } from "./chatRoom/service";
import { DBUserChatRoomService } from "./userChatRoom/service";
import { DBMessageService } from "./message/service";
import { DBGameInfoService } from "./game/gameInfo/service";
import { DBFriendService } from "./friend/service";
import { DBFriendRequestService } from "./friendRequest/service";
import { DBBlockedService } from "./blocked/service";
import { DBNotificationService } from "./notification/service";
import { DBPlayerScoreService } from "./game/player-score/service";
import { DBMessageContentService } from "./messageContent/service";

import { DBUserController } from "./user/controller";
import { DBChatRoomController } from "./chatRoom/controller";
import { DBUserChatRoomController } from "./userChatRoom/controller";
import { DBMessageController } from "./message/controller";
import { DBGameInfoController } from "./game/gameInfo/controller";
import { DBFriendController } from "./friend/controller";
import { DBFriendRequestController } from "./friendRequest/controller";
import { DBBlockedController } from "./blocked/controller";
import { DBNotificationController } from "./notification/controller";

import { Sanitize } from "./sanitize-object";

@Module({
	imports: [
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
				MessageContentEntity,
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
			MessageContentEntity,
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
		DBMessageContentService,
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
		DBMessageContentService,
	],
})
export class DBModule {}
