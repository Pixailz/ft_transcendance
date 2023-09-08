import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { WSSocket } from "../socket.service";
import { DBFriendRequestService } from "src/modules/database/friendRequest/service";

@Injectable()
export class WSFriendService {
	constructor(
		private userService: UserService,
		private dbFriendRequestService: DBFriendRequestService,
		public wsSocket: WSSocket,
	) {}

	async getAllFriend(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllFriend",
			await this.userService.getAllFriend(user_id),
		);
	}

	async getAllFriendRequest(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		socket.emit(
			"getAllFriendRequest",
			await this.userService.getAllFriendRequest(user_id),
		);
	}

	// async acceptFriendReq(server: Server, socket: Socket, user_id: number,  friend_id: number) {
	// 	if (await this.dbFriendRequestService.alreadyFriend(friend_id, user_id) == false)
	// 		return ;

	// 	await this.dbFriendRequestService.acceptReq(friend_id, user_id);
	// 	socket.emit("removeFriendReq", friend_id);
	// }

	// async rejectFriendReq(server: Server, socket: Socket, user_id: number, friend_id: number) {
	// 	if (await this.dbFriendRequestService.alreadyFriend(friend_id, meId) == false)
	// 		return ;
	// 	await this.dbFriendRequestService.rejectReq(friend_id, meId);
	// 	socket.emit("removeFriendReq", friend_id);
	// 	server.to(friend_sock).emit("friendReqStatus", FriendReqStatus.NOTSENT);
	// 	this.sendNotification(server, socket, friend_id, "[Decline Request]")
	// }

	async sendFriendReq(server: Server, socket: Socket, friend_id: number)
	{
		const user_id = this.wsSocket.getUserId(socket.id);

		await this.dbFriendRequestService.create(
													{friendId: friend_id}, user_id);
		const full_request = await this.dbFriendRequestService.getFullRequest(user_id, friend_id);

		this.wsSocket.sendToUser(server, friend_id, "getNewFriendRequest", full_request);
		this.wsSocket.sendToUser(server, user_id, "getNewFriendRequest", full_request);
	}
}
