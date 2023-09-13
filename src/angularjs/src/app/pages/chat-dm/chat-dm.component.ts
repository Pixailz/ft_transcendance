import { Component, OnInit } from '@angular/core';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { ChatDmService } from 'src/app/services/websocket/chat/direct-message/service';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomI } from 'src/app/interfaces/chat-room.interface';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { MessageI } from 'src/app/interfaces/message.inteface';

@Component({
	selector: 'app-chat-dm',
	templateUrl: './chat-dm.component.html',
	styleUrls: ['./chat-dm.component.scss']
})
export class WSChatDmComponent {
	isCreatingRoom: boolean = false;
	message: string = "";

	constructor(
		private wsGateway: WSGateway,
		public friendService: FriendService,
		public chatDmService: ChatDmService,
		public chatRoomService: ChatRoomService,
		public userService: UserService,
	) {}

	onCreateDm(friend: any) {
		this.chatDmService.updateSelectedDm(friend);

		if (friend.room.id === -1)
			return ;
		if (this.chatRoomService.isGoodFullRoom(friend.room))
		{
			console.log( `[chat] dm chat room with ${friend.user_info.ftLogin} already created`)
			return ;
		}
		this.wsGateway.createDmRoom(friend.user_info.id);
		this.onClosePopup();
	}

	onSelectDm(room: ChatRoomI) {
		this.chatDmService.updateSelectedDm(room);
	}

	onSelectFriend(friend: any)
	{
		this.chatDmService.updateSelectedDm(friend);

		const	selected_room = this.chatDmService.getSelectedDm();

		if (!selected_room)
			return ;
	}

	onCreatingRoom() {
		this.isCreatingRoom = true;
	}

	onClosePopup() {
		this.isCreatingRoom = false;
	}

	onPress(event: any)
	{
		if (event.key === "Enter")
			this.sendMessage();
	}

	sendMessage() {
		const selected_dm = this.chatDmService.getSelectedDm();

		if (!this.chatRoomService.isGoodRoom(selected_dm.room))
			return ;
		this.wsGateway.sendDmMessage(selected_dm.room.id, this.message);
		this.message = "";
	}

	getCurrentMessageUser(i: number): UserI
	{
		return (this.getCurrentMessage(i).user);
	}

	getCurrentMessage(i: number): MessageI
	{ return (this.chatRoomService.getCurrentMessage(this.chatDmService.getSelectedDm().room, i)); }

	isSameUser(i: number): boolean {
		const selected_dm = this.chatDmService.getSelectedDm();
		if (selected_dm.room.roomId === -1)
			return (false);

		const current_room = selected_dm.room;
		const message_len = current_room.message.length;

		if (!current_room.message[message_len - i - 2] ||
			current_room.message[message_len - i - 2].id === -1 ||
			current_room.message[message_len - i - 2].id === -1)
			return (false);
		if (current_room.message[message_len - i - 2].userId !== current_room.message[message_len - i - 1].userId)
			return (false);
		return (true);
	}

	isFollowingDay(i: number): boolean {
		const selected_dm = this.chatDmService.getSelectedDm();
		if (selected_dm.id === -1)
			return (false);

		const current_room = selected_dm.room;
		const message_len = current_room.message.length;

		if (!current_room.message[message_len - i - 2] ||
			current_room.message[message_len - i - 2].id === -1 ||
			current_room.message[message_len - i - 2].id === -1)
			return (false);
		if (current_room.message[message_len - i - 2].updateAt?.toString().split('T')[0] !== current_room.message[message_len - i - 1].updateAt?.toString().split('T')[0])
			return (false);
		return (true);
	}
}
