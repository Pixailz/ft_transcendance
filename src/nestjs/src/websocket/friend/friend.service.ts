import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { WSSocket } from "../socket.service";
import { DBFriendRequestService } from "src/modules/database/friendRequest/service";
import { DBFriendService } from "src/modules/database/friend/service";
import { Sanitize } from "../../sanitize-object";

@Injectable()
export class WSFriendService {
	constructor(
		private sanitize: Sanitize,
		private userService: UserService,
		private dbFriendRequestService: DBFriendRequestService,
		private dbFriendService: DBFriendService,
		public wsSocket: WSSocket,
	) {}

	async getAllFriend(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllFriend",
			this.sanitize.Users(await this.userService.getAllFriend(user_id)),
		);
	}

	async getAllFriendRequest(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllFriendRequest",
			this.sanitize.FriendRequests(
				await this.userService.getAllFriendRequest(user_id),
			),
		);
	}

	async acceptFriendRequest(
		server: Server,
		socket: Socket,
		friend_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);
		if (await this.dbFriendService.alreadyFriend(friend_id, user_id))
			return;
		const friend = await this.userService.getInfoById(friend_id);
		const user = await this.userService.getInfoById(user_id);
		await this.dbFriendRequestService.acceptReq(friend_id, user_id);
		this.wsSocket.sendToUsers(
			server,
			[user_id],
			"getNewFriend",
			this.sanitize.User(friend),
		);
		this.wsSocket.sendToUsers(
			server,
			[friend_id],
			"getNewFriend",
			this.sanitize.User(user),
		);
	}

	async rejectFriendRequest(
		server: Server,
		socket: Socket,
		friend_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);

		await this.dbFriendRequestService.rejectReq(friend_id, user_id);
		this.wsSocket.sendToUsers(
			server,
			[user_id, friend_id],
			"deniedFriendReq",
			{
				user_id: user_id,
				target_id: friend_id,
			},
		);
	}

	async sendFriendRequest(server: Server, socket: Socket, friend_id: number) {
		const user_id = this.wsSocket.getUserId(socket.id);

		if (await this.dbFriendService.alreadyFriend(friend_id, user_id))
			return;
		await this.dbFriendRequestService.create(
			{ friendId: friend_id },
			user_id,
		);
		const full_request = await this.dbFriendRequestService.getFullRequest(
			user_id,
			friend_id,
		);
		this.wsSocket.sendToUsers(
			server,
			[friend_id, user_id],
			"getNewFriendRequest",
			this.sanitize.FriendRequest(full_request),
		);
	}
}