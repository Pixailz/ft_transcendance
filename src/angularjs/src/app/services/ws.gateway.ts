import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import {
	ChatRoomI,
	UserI
} from 'src/app/interfaces/chat.interface';

@Injectable({
	providedIn: 'root',
})
export class WSGateway {
	constructor (public socket: Socket) {
		const config = {
			path: "/ws",
			extraHeaders: {
				Authorization: localStorage.getItem("access_token") as string
			},
			autoConnect: false,
		};
		this.socket.ioSocket.io.opts = config;
		this.socket.ioSocket.open();
	}

	listenAllFriend(): Observable<UserI[]>
	{
		return this.socket.fromEvent<UserI[]>("getAllFriend");
	}

	listenAllPrivateRoom(): Observable<ChatRoomI[]>
	{
		return this.socket.fromEvent<ChatRoomI[]>("getAllPrivateRoom");
	}

	listenAllPrivateMessage(): Observable<any>
	{
		return this.socket.fromEvent<any>("getAllPrivateMessage");
	}

	listenNewPrivateRoom(): Observable<ChatRoomI>
	{
		return this.socket.fromEvent<ChatRoomI>("getNewPrivateRoom");
	}

	listenNewStatusFriend(): Observable<any>
	{
		return this.socket.fromEvent<any>("getNewStatusFriend");
	}

	listenNewPrivateMessage(): Observable<any>
	{
		return this.socket.fromEvent<any>("getNewPrivateMessage");
	}

	listenAllReqById() : Observable<number[]>
	{
		return this.socket.fromEvent<number[]>("getAllReqById");
	}

	listenNewReqById() : Observable<number>
	{
		return this.socket.fromEvent<number>("getNewReqById");
	}

	listenRemoveFriendReq() : Observable<number>
	{
		return this.socket.fromEvent<number>("removeFriendReq");
	}

	listenReqStatus() : Observable<number>
	{
		return this.socket.fromEvent<number>("friendReqStatus");
	}



	getAllFriend()
	{
		this.socket.emit("getAllFriend");
	}

	getAllPrivateRoom()
	{
		this.socket.emit("getAllPrivateRoom");
	}

	getAllPrivateMessage()
	{
		this.socket.emit("getAllPrivateMessage");
	}

	createPrivateRoom(dst_id: number)
	{
		this.socket.emit("createPrivateRoom", dst_id);
	}

	sendPrivateMessage(room_id: number, message: string)
	{
		this.socket.emit("sendPrivateMessage", room_id, message);
	}

	getAllReqById()
	{
		this.socket.emit("getAllReqById");
	}

	sendFriendReq(id: number)
	{
		this.socket.emit("sendFriendReq", id);
	}
	
	acceptFriendReq(id: number)
	{
		this.socket.emit("acceptFriendReq", id);
	}

	rejectFriendReq(id: number)
	{
		this.socket.emit("rejectFriendReq", id);
	}

}