import { Module } from "@nestjs/common";

import { WSChatGateway } from "./chat-gateway";
import { AuthModule } from "src/modules/auth/module";
import { DBModule } from "src/modules/database/database.module";
import { UserService } from "src/adapter/user/service";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSService } from "../ws.service";
import { WSChatService } from "./chat-service";

@Module({
	imports: [AuthModule, DBModule],
	providers: [
		WSChatGateway,
		WSService,
		UserService,
		ChatRoomService,
		WSChatService,
	],
})
export class WSChatModule {}
