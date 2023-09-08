import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { RoomAction } from 'src/app/interfaces/chat-channel.interface';
import { ChatRoomI } from 'src/app/interfaces/chat-room.interface';
import { FriendRequestI } from 'src/app/interfaces/friend.interface';
import { UserChatRoomI } from 'src/app/interfaces/user-chat-room.interface';
import { UserI } from 'src/app/interfaces/user.interface';

@Injectable({
	providedIn: 'root',
})
export class WSGateway {
	constructor (
		public socket: Socket,
	) {
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

	// DM CHAT

	// LISTENER
	listenAllDmRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllDmRoom"); }

	listenAllDmMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getAllDmMessage"); }

	listenNewDmRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewDmRoom"); }

	listenNewDmMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewDmMessage"); }

	// EMITER
	getAllDmRoom()
	{ this.socket.emit("getAllDmRoom"); }

	getAllDmMessage()
	{ this.socket.emit("getAllDmMessage"); }

	createDmRoom(dst_id: number)
	{ this.socket.emit("createDmRoom", dst_id); }

	sendDmMessage(room_id: number, message: string)
	{ this.socket.emit("sendDmMessage", room_id, message); }


	// GLOBAL CHAT

	// LISTENER
	listenAllAvailableChannelRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllAvailableChannelRoom"); }

	listenNewAvailableChannelRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewAvailableChannelRoom"); }

	listenAllJoinedChannelRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllJoinedChannelRoom"); }

	listenGetGlobalChatRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getGlobalChatRoom"); }

	listenNewJoinedChannelRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewJoinedChannelRoom"); }

	listenNewGlobalMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewGlobalMessage"); }

	listenNewUserJoinChannelRoom(): Observable<UserChatRoomI>
	{ return this.socket.fromEvent<UserChatRoomI>("getNewUserJoinChannelRoom"); }

	listenNewDetailsChannelRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewDetailsChannelRoom"); }

	listenRoomAction(): Observable<any>
	{ return this.socket.fromEvent<any>("roomAction"); }


	// EMITER
	getAllAvailableChannelRoom()
	{ this.socket.emit("getAllAvailableChannelRoom"); }

	getAllJoinedChannelRoom()
	{ this.socket.emit("getAllJoinedChannelRoom"); }

	createChannelRoom(name: string, password: string, user_id: number[])
	{ this.socket.emit("createChannelRoom", name, password, user_id); }

	joinChannelRoom(room_id: number, password: string)
	{ this.socket.emit("joinChannelRoom", room_id, password); }

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


	// FRIENDS

	// LISTENER
	listenAllFriend(): Observable<UserI[]>
	{ return this.socket.fromEvent<UserI[]>("getAllFriend"); }

	listenAllFriendRequest(): Observable<FriendRequestI[]>
	{ return this.socket.fromEvent<FriendRequestI[]>("getAllFriendRequest"); }

	listenNewFriend(): Observable<UserI>
	{ return this.socket.fromEvent<UserI>("getNewFriend"); }

	listenNewFriendRequest(): Observable<FriendRequestI>
	{ return this.socket.fromEvent<FriendRequestI>("getNewFriendRequest"); }

	listenNewStatusFriend(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewStatusFriend"); }


	// EMITER
	getAllFriend()
	{ this.socket.emit("getAllFriend"); }

	getAllFriendRequest()
	{ this.socket.emit("getAllFriendRequest"); }


	// NOTIFICATION

	// LISTENER
	listenAllReqById() : Observable<number[]>
	{ return this.socket.fromEvent<number[]>("getAllReqById"); }

	listenNewReqById() : Observable<number>
	{ return this.socket.fromEvent<number>("getNewReqById"); }

	listenRemoveFriendReq() : Observable<number>
	{ return this.socket.fromEvent<number>("removeFriendReq"); }

	listenReqStatus() : Observable<number>
	{ return this.socket.fromEvent<number>("friendReqStatus"); }

	listenNotification() : Observable<string>
	{ return this.socket.fromEvent<string>("sendNotification"); }

	// EMITER
	sendFriendReq(id: number)
	{ this.socket.emit("sendFriendReq", id); }

	acceptFriendReq(id: number)
	{ this.socket.emit("acceptFriendReq", id); }

	rejectFriendReq(id: number)
	{ this.socket.emit("rejectFriendReq", id); }
}
