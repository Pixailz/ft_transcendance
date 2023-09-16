import { Server, Socket } from "socket.io";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { WSSocket } from "./socket.service";
import { Status } from "src/modules/database/user/entity";
import { UserService } from "src/adapter/user/service";
import { WSGameService } from "./game/game.service";

@Injectable()
export class WSService {
	constructor(
		private userService: UserService,
		private wsSocket: WSSocket,
		private wsGameService: WSGameService,
	) {}

	async connection(server: Server, socket: Socket) {
		const user_id = this.userService.decodeToken(
			socket.handshake.headers.authorization,
		);
		if (!user_id) {
			socket.emit(
				"Error",
				new UnauthorizedException("Invalid JWT Token"),
			);
			this.disconnect(server, socket);
		}
		const user_info = await this.userService.getInfoById(user_id);
		if (!user_info) {
			this.disconnect(server, socket);
			return new UnauthorizedException(
				`[WS:connection] user, ${user_id}, not found`,
			);
		}
		this.wsSocket.addNewSocketId(user_info.id, socket.id);
		console.log(
			`[WS:connection] User ${user_info.ftLogin} connected (${socket.id})`,
		);
		await this.setStatus(server, user_id, Status.CONNECTED);
		this.wsGameService.disconnect(socket.id);
	}

	async disconnect(server: Server, socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		console.log(`[WS] Disconnected ${socket.id}`);
		await this.setStatus(server, user_id, Status.DISCONNECTED).catch(
			(err) => console.log(err),
		);
		this.wsSocket.removeSocket(socket.id);
	}

	async setStatus(server: Server, user_id: number, status: number) {
		await this.userService.setStatus(user_id, status);
		const friends = await this.userService.getAllFriend(user_id);
		this.wsSocket.sendToUsersInfo(server, friends, "getNewStatusFriend", {
			user_id: user_id,
			status: status,
		});
	}
}
