import { Module } from "@nestjs/common";

import { WSGateway } from "./ws.gateway";
import { AuthModule } from "src/modules/auth/module";
import { DBModule } from "src/modules/database/database.module";
import { UserService } from "src/adapter/user/service";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSChatService } from "./chat/chat.service";
import { WSSocket } from "./socket.service";
import { WSFriendRequestService } from "./friendRequest/friendRequest.service";

@Module({
	imports: [AuthModule, DBModule],
	providers: [
		WSGateway,
		UserService,
		ChatRoomService,
		WSChatService,
		WSSocket,
		WSFriendRequestService,
	],
})
export class WSModule {}
