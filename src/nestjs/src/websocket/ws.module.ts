import { Module } from "@nestjs/common";

import { AuthModule } from "src/modules/auth/module";
import { DBModule } from "src/modules/database/database.module";
import { UserService } from "src/adapter/user/service";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSGateway } from "./ws.gateway";
import { WSSocket } from "./socket.service";
import { WSChatChannelService } from "./chat/chat-channel.service";
import { WSChatDmService } from "./chat/chat-dm.service";
import { WSFriendService } from "./friend/friend.service";
import { WSService } from "./ws.service";

@Module({
	imports: [AuthModule, DBModule],
	providers: [
		UserService,
		ChatRoomService,
		WSSocket,
		WSGateway,
		WSService,
		WSChatDmService,
		WSChatChannelService,
		WSFriendService,
	],
})
export class WSModule {}
