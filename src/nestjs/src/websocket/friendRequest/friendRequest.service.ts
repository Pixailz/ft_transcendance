import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { Status } from "src/modules/database/user/entity";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSSocket } from "../socket.service";
import { DBFriendRequestService } from "src/modules/database/friendRequest/service";

@Injectable()
export class WSFriendRequestService {
	constructor(
		private userService: UserService,
		private friendRequestService: DBFriendRequestService,
		public wsSocket: WSSocket,
	) {}


}