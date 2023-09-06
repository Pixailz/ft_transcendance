import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UserService } from "src/adapter/user/service";
import { WSSocket } from "../socket.service";
import { DBFriendRequestService } from "src/modules/database/friendRequest/service";

@Injectable()
export class WSFriendRequestService {
	constructor(
		private userService: UserService,
		private friendRequestService: DBFriendRequestService,
		public wsSocket: WSSocket,
	) {}

	async getAllReqById(socket: Socket)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		const tmp = await this.friendRequestService.getAllRequest(user_id);
		const dest: number[] = [];
		for (let i = 0; i < tmp.length; i++)
			dest.push(tmp[i].meId);
		socket.emit("getAllReqById", dest);
	}

    async sendFriendReq(server: Server, socket: Socket, friend_id: number) {
        const me_id = this.wsSocket.getUserId(socket.id)
		const friend_sock =  this.wsSocket.getSocketId(friend_id);
        const me = await this.userService.getInfoById(me_id);
		const exist: boolean = await this.friendRequestService.alreadyExist(me_id, friend_id);
		if (exist === false)
		{
			await this.friendRequestService.create({friendId: friend_id}, me_id);
			server.to(friend_sock).emit("getNewReqById", me.id);
		}
    }

	async acceptFriendReq(server: Server, socket: Socket, friend_id: number) {
		const meId = this.wsSocket.getUserId(socket.id);
		if (await this.friendRequestService.alreadyExist(friend_id, meId) == false)
			return ;
		await this.friendRequestService.acceptReq(friend_id, meId);
		socket.emit("removeFriendReq", friend_id);
	}

	async rejectFriendReq(server: Server, socket: Socket, friend_id: number) {
		const meId = this.wsSocket.getUserId(socket.id);
		console.log("in deept reject before if");
		if (await this.friendRequestService.alreadyExist(friend_id, meId) == false)
			return ;
		console.log("in deept reject after if");
		await this.friendRequestService.rejectReq(friend_id, meId);
		socket.emit("removeFriendReq", friend_id);
	}
}