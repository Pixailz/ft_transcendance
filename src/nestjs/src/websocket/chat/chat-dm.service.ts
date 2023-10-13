import { Injectable } from "@nestjs/common";
import { ChatRoomService } from "src/adapter/chatRoom/service";
import { WSSocket } from "../socket.service";
import { Server, Socket } from "socket.io";
import { Sanitize } from "../../modules/database/sanitize-object";
import { DBBlockedService } from "src/modules/database/blocked/service";
import { MessageContentEntity } from "src/modules/database/messageContent/entity";

@Injectable()
export class WSChatDmService {
	constructor(
		private sanitize: Sanitize,
		private chatRoomService: ChatRoomService,
		private dbBlockedService: DBBlockedService,
		public wsSocket: WSSocket,
	) {}

	async getAllDmRoom(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const all_user_chat_room = await this.chatRoomService.getAllDmRoom(
			user_id,
		);
		const rooms = [];
		let j = 0;

		for (let i = 0; i < all_user_chat_room.length; i++) {
			const chat_room = await this.chatRoomService.getDmRoom(
				all_user_chat_room[i].id,
			);
			for (j = 0; j < chat_room.roomInfo.length; j++)
				if (chat_room.roomInfo[j].user.id !== user_id) break;
			if (j === chat_room.roomInfo.length) {
				chat_room.roomInfo.splice(1, 1);
				rooms.push(chat_room);
				continue;
			}

			for (j = 0; j < chat_room.roomInfo.length; j++)
				if (chat_room.roomInfo[j].user.id === user_id)
					chat_room.roomInfo.splice(j, 1);
			rooms.push(chat_room);
		}
		socket.emit("getAllDmRoom", this.sanitize.ChatRooms(rooms));
	}

	async createDmRoom(server: Server, socket: Socket, dst_id: number) {
		const user_id = this.wsSocket.getUserId(socket.id);

		if (await this.dbBlockedService.isBlocked(dst_id, user_id))
			return ;
		const room_id = await this.chatRoomService.createDmRoom(
			user_id,
			dst_id,
		);
		let chat_room = await this.chatRoomService.getDmRoom(room_id);

		for (let i = 0; i < chat_room.roomInfo.length; i++)
			if (chat_room.roomInfo[i].user.id === user_id && user_id !== dst_id)
				chat_room.roomInfo.splice(i, 1);
		this.wsSocket.sendToUser(
			server,
			user_id,
			"getNewDmRoom",
			this.sanitize.ChatRoom(chat_room),
		);
		if (user_id === dst_id) return;
		chat_room = await this.chatRoomService.getDmRoom(room_id);
		for (let i = 0; i < chat_room.roomInfo.length; i++)
			if (chat_room.roomInfo[i].user.id === dst_id)
				chat_room.roomInfo.splice(i, 1);
		this.wsSocket.sendToUser(
			server,
			dst_id,
			"getNewDmRoom",
			this.sanitize.ChatRoom(chat_room),
		);
		return (room_id);
	}

	async getAllDmMessage(socket: Socket): Promise<any> {
		const user_id = this.wsSocket.getUserId(socket.id);
		const chat_room = await this.chatRoomService.getAllDmRoom(user_id);
		const messages: any = {};

		for (let i = 0; i < chat_room.length; i++)
			messages[chat_room[i].id] =
				await this.chatRoomService.getAllDmMessageRoom(chat_room[i].id);
		socket.emit("getAllDmMessage", this.sanitize.Messages(messages));
	}

	async sendDmMessage(
		server: Server,
		socket: Socket,
		dst_id: number,
		message: MessageContentEntity[],
	) {
		const user_id = this.wsSocket.getUserId(socket.id);

		if (await this.dbBlockedService.isBlocked(dst_id, user_id))
			return ;
		const message_id = await this.chatRoomService.sendMessage(
			dst_id,
			user_id,
			message,
		);
		const new_message = await this.chatRoomService.getMessage(message_id);
		const all_user = await this.chatRoomService.getAllUserFromRoom(dst_id);
		this.wsSocket.sendToUsers(server, all_user, "getNewDmMessage", {
			room_id: dst_id,
			message: this.sanitize.Message(new_message),
		});
	}
}
