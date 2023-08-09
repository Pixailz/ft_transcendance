import { Component, OnInit } from '@angular/core';
import { ChatRoomI, DefChatRoomI, DefUserChatRoomI, DefUserI, UserChatRoomI, UserI, MessageI } from 'src/app/services/interface';
import { UserService } from 'src/app/services/user.service';
import { WSChatService } from 'src/app/services/ws-chat';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	isCreatingRoom: boolean = false;

	messages: MessageI[] = [];
	message: string = "";
	dest_user: UserI = DefUserI;
	dest_room: UserChatRoomI = DefUserChatRoomI;
	friends: UserI[] = [];
	rooms: UserChatRoomI[] = [];

	constructor(private wsChatService: WSChatService, private userService: UserService) {}

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
		i = this.messages.length - 1 - i
		if (i >= 0 && i < this.messages.length && j >= 0 && j < this.messages.length)
			if (this.messages[j].user.id == this.messages[i].user.id)
				return (true);
		return (false);
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
		this.message = "";
	}

	onSelectFriend(friend: UserI) {
		this.dest_user = friend;
		console.log("onSelectFriend: ");
		console.log("    dest ", this.dest_user);
		this.createRoom();
		this.onClosePopup();
	}

	onSelectChatroom(room: UserChatRoomI) {
		this.dest_room = room;
		this.wsChatService.emitUpdateMessage(room.roomId);
		console.log("onSelectChatroom: ");
		console.log("    room          ", room);
	}

	getDest(dest: UserI)
	{
		let tmp = dest.ftLogin;
		if (dest.nickname)
			tmp += ` (${dest.nickname})`
		return (tmp);
	}

	onGetInfo()
	{
		console.clear();
		console.log("rooms     ", this.rooms);
		console.log("friends   ", this.friends);
		console.log("dest_room ", this.dest_room);
		console.log("messages  ", this.messages);
	}

	onPress(event: any)
	{
		if (event.key === "Enter")
			this.sendMessage();
	}
}
