import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { UserI } from './interface';

@Injectable({
	providedIn: 'root',
})
export class WSChatService {
	constructor (private socket: Socket) {}

	// sendMessage(user_id: number, message: string): void {
	// 	this.socket.emit("sendMessage", user_id, message);
	// }

	sendMessage(user_login: string, message: string): void {
		this.socket.emit("sendMessage", user_login, message);
	}

	sendRoomIds(user_id: number)
	{
		this.socket.emit("sendRoomIds", user_id);
	}

	sendFriendIds(user_id: number)
	{
		this.socket.emit("sendFriendIds", user_id);
	}

	getNewMessage(): Observable<string> {
		return this.socket.fromEvent<string>("newMessage");
	}

	getRoomIds(): Observable<number[]> {
		return this.socket.fromEvent<number[]>("newRoomIds");
	}

	getFriendIds(): Observable<UserI[]> {
		return this.socket.fromEvent<UserI[]>("newFriendIds");
	}
}
