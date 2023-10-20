import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { RoomAction } from 'src/app/interfaces/chat/channel.interface';
import { ChatRoomI } from 'src/app/interfaces/chat/chat-room.interface';
import { UserChatRoomI } from 'src/app/interfaces/chat/user-chat-room.interface';
import { FriendRequestI } from 'src/app/interfaces/user/friend.interface';
import { UserI } from 'src/app/interfaces/user/user.interface';
import { NotifStatus, NotificationI } from 'src/app/interfaces/notification.interface';
import { GameOptionI, GameStateI } from 'src/app/interfaces/game/game-room.interface';
import { MessageContentI } from 'src/app/interfaces/chat/message.inteface';

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
		this.socket.connect();
	}

	// DM CHAT

	// LISTENER
	listenAllDmRoom(): Observable<ChatRoomI[]>
	{ return this.socket.fromEvent<ChatRoomI[]>("getAllDmRoom"); }

	listenNewDmRoom(): Observable<ChatRoomI>
	{ return this.socket.fromEvent<ChatRoomI>("getNewDmRoom"); }

	listenNewDmMessage(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewDmMessage"); }

	// EMITER
	getAllDmRoom()
	{ this.socket.emit("getAllDmRoom"); }

	createDmRoom(dst_id: number)
	{ this.socket.emit("createDmRoom", dst_id); }

	sendDmMessage(room_id: number, message: MessageContentI[])
	{ this.socket.emit("sendDmMessage", room_id, message); }


	// CHANNEL CHAT

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

	listenChannelMute(): Observable<UserChatRoomI>
	{ return this.socket.fromEvent<UserChatRoomI>("channelMute"); }

	// EMITER
	getAllAvailableChannelRoom()
	{ this.socket.emit("getAllAvailableChannelRoom"); }

	getAllJoinedChannelRoom()
	{ this.socket.emit("getAllJoinedChannelRoom"); }

	createChannelRoom(name: string, password: string, is_private: number, user_id: number[])
	{ this.socket.emit("createChannelRoom", name, password, is_private, user_id); }

	joinChannelRoom(room_id: number, password: string)
	{ this.socket.emit("joinChannelRoom", room_id, password); }

	sendGlobalMessage(room_id: any, message: MessageContentI[])
	{ this.socket.emit("sendGlobalMessage", room_id, message); }

	changeRoomDetails(room_id: number, data: any)
	{
		this.socket.emit("changeRoomDetails", room_id, {
			name: data.name,
			password: data.password,
			remove_pass: data.remove_pass,
			change_private: data.change_private,
			is_private: data.is_private,
		});
	}

	addUserToRoom(room_id: number, user_id: number[])
	{ this.socket.emit("addUserToRoom", room_id, user_id);}

	leaveRoom(room_id: number, user_id: number)
	{ this.socket.emit("leaveRoom", room_id, user_id); }

	roomAction(room_id: number, action: RoomAction, target_id: number)
	{ this.socket.emit("roomAction", room_id, action, target_id); }

	channelMute(room_id: number, target_id: number, muted_time: number)
	{ this.socket.emit("channelMute", room_id, target_id, muted_time); }

	// FRIENDS

	// LISTENER
	listenAllFriend(): Observable<UserI[]>
	{ return this.socket.fromEvent<UserI[]>("getAllFriend"); }

	listenNewStatusFriend(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewStatusFriend"); }

	listenNewFriend(): Observable<UserI>
	{ return this.socket.fromEvent<UserI>("getNewFriend"); }

	listenAllFriendRequest(): Observable<FriendRequestI[]>
	{ return this.socket.fromEvent<FriendRequestI[]>("getAllFriendRequest"); }

	listenNewFriendRequest(): Observable<FriendRequestI>
	{ return this.socket.fromEvent<FriendRequestI>("getNewFriendRequest"); }

	listenDeniedFriendReq(): Observable<any>
	{ return this.socket.fromEvent<any>("deniedFriendReq")}

	listenAllBlocked(): Observable<any[]>
	{ return this.socket.fromEvent<any[]>("getAllBlocked")}

	listenNewBlocked(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewBlocked")}

	listenNewUnblocked(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewUnblocked")}


	// EMITER
	getAllFriend()
	{ this.socket.emit("getAllFriend"); }

	getAllFriendRequest()
	{ this.socket.emit("getAllFriendRequest"); }

	getAllBlocked()
	{ this.socket.emit("getAllBlocked"); }

	sendFriendRequest(id: number)
	{ this.socket.emit("sendFriendRequest", id); }

	acceptFriendRequest(id: number)
	{ this.socket.emit("acceptFriendRequest", id); }

	rejectFriendRequest(id: number)
	{ this.socket.emit("rejectFriendRequest", id); }

	blockUser(target_id : number)
	{ this.socket.emit("blockUser", target_id); }

	unblockUser(target_id : number)
	{ this.socket.emit("unblockUser", target_id); }

	// NOTIFICATION

	// LISTENER
	listenAllNotifications(): Observable<any>
	{ return this.socket.fromEvent<any>("getAllNotifications") }

	listenNewNotification(): Observable<any>
	{ return this.socket.fromEvent<any>("getNewNotification") }

	listenDelNotification(): Observable<number>
	{ return this.socket.fromEvent<number>("delNotification") }

	listenSeenNotification(): Observable<number>
	{ return this.socket.fromEvent<number>("updateSeenNotification")}

	// EMITER
	getAllNotifications()
	{ this.socket.emit("getAllNotifications"); }

	updateNotificationStatus(notif_id: number, status: NotifStatus)
	{ this.socket.emit("updateNotificationStatus", status, notif_id); }


	// GAME

	// LISTENER
	listenGameWaiting(): Observable<null>
	{ return this.socket.fromEvent<null>("gameWaiting"); }

	listenIsInGame(): Observable<null>
	{ return this.socket.fromEvent<null>("isInGame"); }

	listenGameStarting(): Observable<any>
	{ return this.socket.fromEvent<any>("gameStarting"); }

	listenGameReconnect(): Observable<GameStateI>
	{ return this.socket.fromEvent<GameStateI>("gameReconnect"); }

	listenGameEnded(): Observable<any>
	{ return this.socket.fromEvent<any>("gameEnded"); }

	listenGameState(): Observable<GameStateI>
	{ return this.socket.fromEvent<GameStateI>("gameState"); }

	// EMITER
	searchGame(game_option: GameOptionI)
	{ this.socket.emit("gameSearch", game_option); }

	joinGame(game_id: string)
	{ this.socket.emit("gameJoin", game_id); }

	isInGame()
	{ this.socket.emit("isInGame"); }

	reconnectGame(game_id: string)
	{ this.socket.emit("gameReconnect", game_id); }

	sendInput(direction: string, type: string, pending_input: number)
	{ this.socket.emit("gameSendInput", direction, type, pending_input); }

	//GAME REQUEST
	// LISTENER

	// EMITER
	sendGameInvite(user_id: number, room_id: string)
	{ this.socket.emit("gameSendInvite", room_id, user_id); }

	delGameInvite(id: number)
	{ this.socket.emit("delGameInvite", id) }

	acceptGameInvite(id: number)
	{ this.socket.emit("acceptGameInvite", id) }

	declineGameInvite(id: number)
	{ this.socket.emit("declineGameInvite", id) }
}
