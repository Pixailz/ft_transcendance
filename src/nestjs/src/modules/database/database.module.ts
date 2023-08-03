import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { UserEntity } from "./user/entity";
import { UserService } from "./user/service";
import { UserController } from "./user/controller";

import { ChatRoomEntity } from "./chatRoom/entity";
import { ChatRoomService } from "./chatRoom/service";
import { ChatRoomController } from "./chatRoom/controller";

import { UserChatRoomEntity } from "./userChatRoom/entity";
import { UserChatRoomService } from "./userChatRoom/service";
import { UserChatRoomController } from "./userChatRoom/controller";

import { MessageEntity } from "./message/entity";
import { MessageService } from "./message/service";
import { MessageController } from "./message/controller";

import { GameInfoEntity } from "./gameInfo/entity";
import { GameInfoService } from "./gameInfo/service";
import { GameInfoController } from "./gameInfo/controller";

@Module({imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "postgresql",
			port: 5432,
			username: process.env.DB_USER.toString(),
			password: process.env.DB_PASS.toString(),
			database: process.env.DB_NAME.toString(),
			entities: [UserEntity, ChatRoomEntity, UserChatRoomEntity, MessageEntity, GameInfoEntity],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([UserEntity, ChatRoomEntity, UserChatRoomEntity, MessageEntity, GameInfoEntity]),
	],
	controllers: [UserController, ChatRoomController, UserChatRoomController, MessageController, GameInfoController],
	providers: [UserService, ChatRoomService, UserChatRoomService, MessageService, GameInfoService],
	exports: [UserService, ChatRoomService, UserChatRoomService, MessageService, GameInfoService],
})
export class DbModule {}
