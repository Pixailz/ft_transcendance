import { Component, OnInit } from '@angular/core';
import {
	UserI,
	ChatRoomI,
	FriendI,
} from 'src/app/interfaces/chat.interface';
import { WSGateway } from 'src/app/services/ws.gateway';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	isCreatingRoom: boolean = false;
	message: string = "";

	constructor(
		private wsGateway: WSGateway,
		public chatService: ChatService,
		public userService: UserService,
	) {}

	async ngOnInit() {
		await this.chatService.updateUserInfo();
		this.wsGateway.getAllFriend();
		this.wsGateway.listenAllFriend()
			.subscribe((friends: UserI[]) => {
				console.log("event AllFriend received ");
				this.chatService.updateAllFriend(friends);
			}
		)

		this.wsGateway.getAllPrivateRoom();
		this.wsGateway.listenAllPrivateRoom()
			.subscribe((rooms: ChatRoomI[]) => {
				console.log("event AllPrivateRoom received")
				this.chatService.updateAllPrivateRoom(rooms);
			}
		)

		this.wsGateway.getAllPrivateMessage();
		this.wsGateway.listenAllPrivateMessage()
			.subscribe((data: any) => {
				console.log("event AllPrivateMessage received")
				this.chatService.updateAllPrivateMessage(data);
			}
		)

		this.wsGateway.listenNewPrivateRoom()
			.subscribe((room: ChatRoomI) => {
				console.log("event NewPrivateRoom received")
				this.chatService.updateNewPrivateRoom(room);
			}
		)

		this.wsGateway.listenNewPrivateMessage()
			.subscribe((data: any) => {
				console.log("event NewPrivateMessage received")
				this.chatService.updateNewPrivateMessage(data);
			}
		)

		this.wsGateway.listenNewStatusFriend()
			.subscribe((data: any) => {
				console.log("event NewStatusFriend received")
				this.chatService.updateNewFriendStatus(data);
			}
		)
	}

	onCreateFriend(friend: FriendI) {
		this.chatService.updateSelectedFriend(friend);

		const	selected_friend = this.chatService.getSelectedFriend();
		if (selected_friend.user_info.id === -1)
			return ;
		if (this.chatService.isGoodFriendRoom(selected_friend.room))
		{
			console.log( `[chat] private chat room with ${selected_friend
				.user_info.ftLogin} already created`)
			return ;
		}
		this.wsGateway.createPrivateRoom(selected_friend.user_info.id);
		this.onClosePopup();
	}

	onSelectFriend(friend: FriendI) {
		this.chatService.updateSelectedFriend(friend);

		const	selected_room = this.chatService.getSelectedFriendRoom();

		if (!selected_room)
			return ;
	}

	onCreatingRoom() {
		this.isCreatingRoom = true;
	}

	onClosePopup() {
		this.isCreatingRoom = false;
	}

	onGetInfo()
	{
		this.chatService.getInfo()
	}

	onPress(event: any)
	{
		if (event.key === "Enter")
			this.sendMessage();
	}

	sendMessage() {
		const selected_room = this.chatService.getSelectedFriendRoom();

		if (selected_room.id === -1)
			return ;
		this.wsGateway.sendPrivateMessage(selected_room.id, this.message);
		this.message = "";
	}

	isSameUser(i: number): boolean {
		const selected_room = this.chatService.getSelectedFriendRoom();
		if (selected_room.id === -1)
			return (false);

		const message_len = selected_room.message.length;

		if (!selected_room.message[message_len - i - 2] ||
			selected_room.message[message_len - i - 2].id === -1 ||
			selected_room.message[message_len - i - 2].id === -1)
			return (false);
		if (selected_room.message[message_len - i - 2].userId !== selected_room.message[message_len - i - 1].userId)
			return (false);
		return (true);
	}

	isFollowingDay(i: number): boolean {
		const selected_room = this.chatService.getSelectedFriendRoom();
		if (selected_room.id === -1)
			return (false);

		const message_len = selected_room.message.length;

		if (!selected_room.message[message_len - i - 2] ||
			selected_room.message[message_len - i - 2].id === -1 ||
			selected_room.message[message_len - i - 2].id === -1)
			return (false);
		if (selected_room.message[message_len - i - 2].updateAt?.toString().split('T')[0] !== selected_room.message[message_len - i - 1].updateAt?.toString().split('T')[0])
			return (false);
		return (true);
	}
}
