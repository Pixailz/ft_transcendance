import { Module } from "@nestjs/common";

import { WSChatGateway } from "./chat.gateway";
import { AuthModule } from "src/modules/auth/module";
import { DBModule } from "src/modules/database/database.module";
import { UserService } from "src/adapter/user/service";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSChatService } from "./chat.service";
import { WSSocket } from "../socket.service";

@Module({
	imports: [AuthModule, DBModule],
	providers: [
		WSChatGateway,
		UserService,
		ChatRoomService,
		WSChatService,
		WSSocket,
	],
})
export class WSChatModule {}
