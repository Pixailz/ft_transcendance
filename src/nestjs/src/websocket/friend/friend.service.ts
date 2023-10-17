import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "../../adapter/user/service";
import { WSSocket } from "../socket.service";
import { DBFriendRequestService } from "../../modules/database/friendRequest/service";
import { DBFriendService } from "../../modules/database/friend/service";
import { Sanitize } from "../../modules/database/sanitize-object";
import { WSNotificationService } from "../notifications/notifications.service";
import { DBBlockedService } from "../../modules/database/blocked/service";
import { UserMetricsService } from "../../modules/database/metrics/service";

@Injectable()
export class WSFriendService {
	constructor(
		private sanitize: Sanitize,
		private userService: UserService,
		private dbFriendRequestService: DBFriendRequestService,
		private dbFriendService: DBFriendService,
		private dbBlockedService: DBBlockedService,
		private metricsService: UserMetricsService,
		public wsSocket: WSSocket,
		public wsNotificationService: WSNotificationService,
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

	async getAllBlocked(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllBlocked",
			await this.dbBlockedService.getAllBlocked(user_id),
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
		await this.metricsService.updateMetrics(user);
		await this.metricsService.updateMetrics(friend);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewFriend",
			this.sanitize.User(friend),
		);
		this.wsSocket.sendToUser(
			server,
			friend_id,
			"getNewFriend",
			this.sanitize.User(user),
		);
		await this.wsNotificationService.acceptFriendRequest(
			server,
			friend_id,
			user_id,
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
		await this.wsNotificationService.rejectFriendRequest(
			server,
			friend_id,
			user_id,
		);
	}

	async blockUser(
		server: Server,
		socket: Socket,
		target_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);

		if (await this.dbBlockedService.isBlocked(user_id, target_id))
			return ;
		await this.dbBlockedService.create({meId: user_id, targetId: target_id});
		const blocked_data = await this.dbBlockedService.returnOne(user_id, target_id);
		this.wsSocket.sendToUser(server, user_id, "getNewBlocked", blocked_data);
		this.wsSocket.sendToUser(server, target_id, "getNewBlocked", blocked_data);
	}

	async unblockUser(
		server: Server,
		socket: Socket,
		target_id: number,
	) {
		const user_id = this.wsSocket.getUserId(socket.id);

		if (!await this.dbBlockedService.isBlocked(user_id, target_id))
			return ;
		await this.dbBlockedService.delete(user_id, target_id);
		const data = {
			me: user_id,
			target: target_id,
		}
		this.wsSocket.sendToUser(server, user_id, "getNewUnblocked", data);
		this.wsSocket.sendToUser(server, target_id, "getNewUnblocked", data);
	}

	async sendFriendRequest(server: Server, socket: Socket, friend_id: number) {
		const user_id = this.wsSocket.getUserId(socket.id);

		if (await this.dbFriendService.alreadyFriend(friend_id, user_id))
			return;
		if (await this.dbFriendRequestService.alreadySent(user_id, friend_id))
			return ;
		if (await this.dbFriendRequestService.alreadySent(friend_id, user_id)) {
			await this.acceptFriendRequest(server, socket, friend_id);
			return;
		}
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
		this.wsNotificationService.sendFriendRequest(
			server,
			friend_id,
			user_id,
		);
	}
}
