import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { ChatRoomEntity } from "../modules/database/chatRoom/entity";
import { UserEntity } from "../modules/database/user/entity";
import { LobbyI } from "./game/game.interface";

@Injectable()
export class WSSocket {
	socket_list: any = {};

	addNewSocketId(user_id: number, socket_id: string) {
		if (this.socket_list[user_id] !== undefined)
			this.socket_list[user_id].push(socket_id);
		else this.socket_list[user_id] = [socket_id];
	}

	getSocketId(user_id: number): string[] | undefined {
		for (const user_id_str in this.socket_list)
			if (user_id == Number(user_id_str))
				return this.socket_list[user_id_str];
		return undefined;
	}

	getUserId(socket_id: string): number | undefined {
		for (const user_id in this.socket_list) {
			for (let i = 0; i < this.socket_list[user_id].length; i++)
				if (this.socket_list[user_id][i] === socket_id)
					return Number(user_id);
		}
		return undefined;
	}

	removeSocket(socket_id: string) {
		for (const user_id in this.socket_list) {
			for (let i = 0; i < this.socket_list[user_id].length; i++)
				if (this.socket_list[user_id][i] === socket_id)
					this.socket_list[user_id].splice(i, 1);
			if (!this.socket_list[user_id].length)
				delete this.socket_list[user_id];
		}
	}

	sendToUser(server: Server, user_id: number, event: string, data: any) {
		const socket_ids = this.getSocketId(user_id);
		if (!socket_ids) return;
		for (let i = 0; i < socket_ids.length; i++)
			server.to(socket_ids[i]).emit(event, data);
	}

	sendToUsers(server: Server, user_ids: number[], event: string, data: any) {
		for (var i = 0; i < user_ids.length; i++)
			this.sendToUser(server, user_ids[i], event, data);
	}

	sendToUserInfo(server: Server, user: UserEntity, event: string, data: any) {
		this.sendToUser(server, user.id, event, data);
	}

	sendToUsersInfo(
		server: Server,
		users: UserEntity[],
		event: string,
		data: any,
	) {
		for (var i = 0; i < users.length; i++)
			this.sendToUserInfo(server, users[i], event, data);
	}

	sendToAllSocket(server: Server, event: string, data: any) {
		for (const user_id in this.socket_list)
			this.sendToUsers(server, [Number(user_id)], event, data);
	}

	sendToUserInRoom(
		server: Server,
		room: ChatRoomEntity,
		event: string,
		data: any,
	) {
		var user_list: number[] = [];

		for (var i = 0; i < room.roomInfo.length; i++)
			user_list.push(room.roomInfo[i].userId);
		this.sendToUsers(server, user_list, event, data);
	}

	sendToUserInGame(server: Server, room: LobbyI, event: string, data: any) {
		for (var user_id in room.players)
			if (room.players[user_id].socket !== "")
				server.to(room.players[user_id].socket).emit(event, data);
	}

	sendStatusToGame(server: Server, room: LobbyI)
	{ this.sendToUserInGame(server, room, "gameState", room.state); }
}
