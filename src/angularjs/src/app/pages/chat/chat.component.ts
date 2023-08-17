import { Component, OnInit } from '@angular/core';
import {
	DefUserChatRoomI,
	DefUserI,
	UserChatRoomI,
	UserI,
	MessageI
} from 'src/app/interfaces/chat.interface';
import { UserService } from '../../services/user.service';
import { WSChatService } from 'src/app/services/ws-chat';

export enum Status {
	DISCONNECTED,
	CONNECTED,
	AWAY,
}

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	isCreatingRoom: boolean = false;
	user: UserI = DefUserI;

	messages: MessageI[] = [];
	message: string = "";
	dest_user: UserI = DefUserI;
	dest_room: UserChatRoomI = DefUserChatRoomI;
	friends: UserI[] = [];
	friends_status = {};
	rooms: UserChatRoomI[] = [];

	constructor(private wsChatService: WSChatService,
				private userService: UserService) {}

	async ngOnInit() {
		this.user = await this.userService.getUserInfo();
		this.wsChatService.emitRoom();
		this.wsChatService.listenNewRoom()
			.subscribe((rooms: UserChatRoomI[]) => {
				this.rooms = rooms;
			}
		)
		this.wsChatService.emitFriend();
		this.wsChatService.listenNewFriend()
			.subscribe((friends: UserI[]) => {
				this.friends = friends;
			}
		)
		this.wsChatService.emitStatusFriend();
		this.wsChatService.listenNewStatusFriend()
			.subscribe((friends_status: any) => {
				this.friends_status = friends_status;
			}
		)
		this.wsChatService.listenNewMessage()
			.subscribe((messages: MessageI[]) => {
				this.messages = messages;
			}
		)
	}

	onCreatingRoom() {
		this.isCreatingRoom = true;
	}

	onClosePopup() {
		this.isCreatingRoom = false;
	}

	isSameUser(i: number) {
		let j = this.messages.length - 2 - i;
		i = this.messages.length - 1 - i;
		if (i >= 0 && i < this.messages.length && j >= 0 && j < this.messages.length)
			if (this.messages[j].user.id == this.messages[i].user.id)
				return (true);
		return (false);
	}

	isFollowingDay(i: number) {
		let j = this.messages.length - 2 - i;
		i = this.messages.length - 1 - i;
		if (i >= 0 && i < this.messages.length && j >= 0 && j < this.messages.length)
			if (this.messages[j].updateAt?.toString().split('T')[0] === this.messages[i].updateAt?.toString().split('T')[0])
				return (true);
		return (false);
	}

	createRoom() {
		if (this.dest_user.id === -1) return ;
		this.wsChatService.emitCreateRoom(this.dest_user.id)
	}

	sendMessage() {
		if (!this.message) return ;
		if (this.dest_room.roomId === -1) return ;
		this.wsChatService.emitMessage(this.dest_room.roomId, this.message);
		this.message = "";
	}

	onSelectFriend(friend: UserI) {
		this.dest_user = friend;
		this.createRoom();
		this.onClosePopup();
	}

	onSelectChatroom(room: UserChatRoomI) {
		this.dest_room = room;
		this.wsChatService.emitUpdateMessage(room.roomId);
	}

	getUserInfo(dest: UserI)
	{
		var tmp;
		var string = JSON.stringify(this.friends_status);
		var objectValue = JSON.parse(string);

		switch (objectValue[dest.id]) {
			// case Status.CONNECTED: {
			// 	const last_seen = new Date(dest.lastSeen);
			// 	const now = new Date(Date.now());
			// 	console.log("last ", last_seen);
			// 	console.log("now  ", now);
			// 	if (last_seen.getTime() < now.getTime() - 5000)
			// 		tmp = "🟠 ";
			// 	else
			// 		tmp = "🟢 ";
			// 	break ;
			// }
			case Status.AWAY: {
				tmp = "🟠 ";
				break ;
			}
			case Status.CONNECTED: {
				tmp = "🟢 ";
				break ;
			}
			case Status.DISCONNECTED: {
				tmp = "⚫ "
				break ;
			}
		}
		tmp += dest.ftLogin + " ";
		if (dest.nickname)
			tmp += ` (${dest.nickname})`
		return (tmp);
	}

	onGetInfo()
	{
		console.clear();
		console.log("rooms          ", this.rooms);
		console.log("friends        ", this.friends);
		console.log("friends_status ", this.friends_status);
		console.log("dest_room      ", this.dest_room);
		console.log("messages       ", this.messages);
	}

	onPress(event: any)
	{
		if (event.key === "Enter")
			this.sendMessage();
	}
}
