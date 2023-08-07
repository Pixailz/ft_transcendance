import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

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

	getNewMessage(): Observable<string> {
		return this.socket.fromEvent<string>("newMessage")
	}
}
