import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { MessageI, UserChatRoomI, UserI } from './interface';

@Injectable({
	providedIn: 'root',
})
export class WSChatService {
	constructor (private socket: Socket) {}

	listenNewRoom(): Observable<UserChatRoomI[]>
	{
		return this.socket.fromEvent<UserChatRoomI[]>("getNewRoom");
	}

	listenNewFriend(): Observable<UserI[]>
	{
		return this.socket.fromEvent<UserI[]>("getNewFriend");
	}

	listenNewMessage(): Observable<MessageI[]>
	{
		return this.socket.fromEvent<MessageI[]>("getNewMessage");
	}

	emitNewMessage(room_id: number, message: string)
	{
		this.socket.emit("sendNewMessage", room_id, message);
	}

	emitUpdateMessage(room_id: number)
	{
		this.socket.emit("sendUpdateMessage", room_id);
	}

	emitMessage(room_id: number, message: string)
	{
		this.socket.emit("sendNewMessage", room_id, message);
	}

	emitRoom()
	{
		this.socket.emit("sendNewRoom");
	}

	emitCreateRoom(room_id: number)
	{
		this.socket.emit("sendCreateRoom", room_id);
	}

	emitFriend()
	{
		this.socket.emit("sendNewFriend");
	}
}
