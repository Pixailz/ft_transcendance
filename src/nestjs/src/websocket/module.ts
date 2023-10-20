import { Module, forwardRef } from "@nestjs/common";

import { AuthModule } from "../modules/auth/module";
import { DBModule } from "../modules/database/database.module";
import { UserService } from "../adapter/user/service";
import { ChatRoomService } from "../adapter/chatRoom/service";
import { WSGateway } from "./gateway";
import { WSSocket } from "./socket.service";
import { WSChatChannelService } from "./chat/chat-channel.service";
import { WSChatDmService } from "./chat/chat-dm.service";
import { WSFriendService } from "./friend/friend.service";
import { WSService } from "./service";
import { Sanitize } from "../modules/database/sanitize-object";
import { WSNotificationService } from "./notifications/notifications.service";
import { WSGameService } from "./game/game.service";
import { BrcyptWrap } from "../addons/bcrypt.wrapper";


@Module({
	imports: [
		AuthModule,
		forwardRef(() => DBModule),
	],
	providers: [
		Sanitize,
		UserService,
		ChatRoomService,
		BrcyptWrap,
		WSSocket,
		WSGateway,
		WSService,
		WSChatDmService,
		WSChatChannelService,
		WSFriendService,
		WSNotificationService,
		WSGameService,
	],
	exports: [
		WSSocket,
		WSGateway,
		WSService,
		WSChatDmService,
		WSChatChannelService,
		WSFriendService,
		WSNotificationService,
		WSGameService,
	]
})
export class WSModule {}
