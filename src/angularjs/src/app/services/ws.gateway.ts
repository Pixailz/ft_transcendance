import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { FriendRequestI } from '../interfaces/friend.interface';
import { UserI } from '../interfaces/user.interface';
import { ChatRoomI } from '../interfaces/chat-room.interface';
import { UserChatRoomI } from '../interfaces/user-chat-room.interface';
import { RoomAction } from '../interfaces/chat-channel.interface';

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

	// FRIENDS
	listenAllFriend(): Observable<UserI[]>
	{ return this.socket.fromEvent<UserI[]>("getAllFriend"); }

	listenAllFriendRequest(): Observable<FriendRequestI[]>
	{ return this.socket.fromEvent<FriendRequestI[]>("getAllFriendRequest"); }

	listenNewFriend(): Observable<UserI>
	{ return this.socket.fromEvent<UserI>("getNewFriend"); }

	listenNewStatusFriend(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewStatusFriend"); }


	getAllFriend()
	{ this.socket.emit("getAllFriend"); }

	sendFriendReq(id: number)
	{ this.socket.emit("sendFriendRequest", id); }

	acceptFriendReq(id: number)
	{ this.socket.emit("acceptFriendRequest", id); }

	rejectFriendReq(id: number)
	{ this.socket.emit("rejectFriendRequest", id); }


	// PRIVATE CHAT
	listenAllPrivateRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllPrivateRoom"); }

	listenAllPrivateMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getAllPrivateMessage"); }

	listenNewPrivateRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewPrivateRoom"); }

	listenNewPrivateMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewPrivateMessage"); }


	getAllPrivateRoom()
	{ this.socket.emit("getAllPrivateRoom"); }

	getAllPrivateMessage()
	{ this.socket.emit("getAllPrivateMessage"); }

	createPrivateRoom(dst_id: number)
	{ this.socket.emit("createPrivateRoom", dst_id); }

	sendPrivateMessage(room_id: number, message: string)
	{ this.socket.emit("sendPrivateMessage", room_id, message); }


	// GLOBAL CHAT
	listenAllAvailableGlobalRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllAvailableGlobalRoom"); }

	listenNewAvailableGlobalRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewAvailableGlobalRoom"); }

	listenAllJoinedGlobalRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllJoinedGlobalRoom"); }

	listenGetGlobalChatRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getGlobalChatRoom"); }

	listenNewJoinedGlobalRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewJoinedGlobalRoom"); }

	listenNewGlobalMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewGlobalMessage"); }

	listenNewUserJoinGlobalRoom(): Observable<UserChatRoomI>
	{ return this.socket.fromEvent<UserChatRoomI>("getNewUserJoinGlobalRoom"); }

	listenNewDetailsGlobalRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewDetailsGlobalRoom"); }

	listenRoomAction(): Observable<any>
	{ return this.socket.fromEvent<any>("roomAction"); }


	getAllAvailableGlobalRoom()
	{ this.socket.emit("getAllAvailableGlobalRoom"); }

	getAllJoinedGlobalRoom()
	{ this.socket.emit("getAllJoinedGlobalRoom"); }

	getGlobalChatRoom()
	{ this.socket.emit("getGlobalChatRoom"); }

	createGlobalRoom(name: string, password: string, user_id: number[])
	{ this.socket.emit("createGlobalRoom", name, password, user_id); }

	joinGlobalRoom(room_id: number, password: string)
	{ this.socket.emit("joinGlobalRoom", room_id, password); }

	sendGlobalMessage(room_id: any, message: string)
	{ this.socket.emit("sendGlobalMessage", room_id, message); }

	changeRoomDetails(room_id: number, data: any)
	{ this.socket.emit("changeRoomDetails", room_id, {
			name: data.name,
			password: data.password,
			remove_pass: data.remove_pass,
		}); }

	roomAction(room_id: number, action: RoomAction, target_id: number)
	{ this.socket.emit("roomAction", room_id, action, target_id); }
}
