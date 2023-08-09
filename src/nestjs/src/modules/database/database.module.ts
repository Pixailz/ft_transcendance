import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./user/entity";
import { ChatRoomEntity } from "./chatRoom/entity";
import { UserChatRoomEntity } from "./userChatRoom/entity";
import { MessageEntity } from "./message/entity";
import { GameInfoEntity } from "./gameInfo/entity";

import { DBUserService } from "./user/service";
import { DBChatRoomService } from "./chatRoom/service";
import { DBUserChatRoomService } from "./userChatRoom/service";
import { DBMessageService } from "./message/service";
import { DBGameInfoService } from "./gameInfo/service";

import { DBUserController } from "./user/controller";
import { DBChatRoomController } from "./chatRoom/controller";
import { DBUserChatRoomController } from "./userChatRoom/controller";
import { DBMessageController } from "./message/controller";
import { DBGameInfoController } from "./gameInfo/controller";

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
			],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([
			UserEntity,
			ChatRoomEntity,
			UserChatRoomEntity,
			MessageEntity,
			GameInfoEntity,
		]),
	],
	controllers: [
		DBUserController,
		DBChatRoomController,
		DBUserChatRoomController,
		DBMessageController,
		DBGameInfoController,
	],
	providers: [
		DBUserService,
		DBChatRoomService,
		DBUserChatRoomService,
		DBMessageService,
		DBGameInfoService,
	],
	exports: [
		DBUserService,
		DBChatRoomService,
		DBUserChatRoomService,
		DBMessageService,
		DBGameInfoService,
	],
})
export class DBModule {}
