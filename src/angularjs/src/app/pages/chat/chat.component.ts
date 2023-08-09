import { Component, OnInit } from '@angular/core';
import { DefUserChatRoomI, DefUserI, UserChatRoomI, UserI, MessageI } from 'src/app/services/chat.interface';
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
	messages: MessageI[] = [];
	message: string = "";
	dest_user: UserI = DefUserI;
	dest_room: UserChatRoomI = DefUserChatRoomI;
	friends: UserI[] = [];
	friends_status = {};
	rooms: UserChatRoomI[] = [];

	constructor(private wsChatService: WSChatService) {}

	async ngOnInit() {
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

	createRoom() {
		if (this.dest_user.id === -1) return ;
		this.wsChatService.emitCreateRoom(this.dest_user.id)
	}

	sendMessage() {
		console.log("message ", this.message);
		console.log("dest_id ", this.dest_room);
		if (!this.message) return ;
		if (this.dest_room.roomId === -1) return ;
		this.wsChatService.emitMessage(this.dest_room.roomId, this.message);
	}

	onSelectFriend(friend: UserI) {
		this.dest_user = friend;
		console.log("onSelectFriend: ");
		console.log("    dest ", this.dest_user);
	}

	onSelectChatroom(room: UserChatRoomI) {
		this.dest_room = room;
		this.wsChatService.emitUpdateMessage(room.roomId);
		console.log("onSelectChatroom: ");
		console.log("    room          ", room);
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
}
