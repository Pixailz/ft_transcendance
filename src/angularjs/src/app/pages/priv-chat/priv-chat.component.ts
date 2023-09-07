import { Component, OnInit } from '@angular/core';
import {
	UserI,
	ChatRoomI,
	FriendI,
} from 'src/app/interfaces/chat.interface';
import { WSGateway } from 'src/app/services/ws.gateway';
import { PrivChatService } from './priv-chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-private-chat',
	templateUrl: './priv-chat.component.html',
	styleUrls: ['./priv-chat.component.scss']
})
export class WSPrivChatComponent implements OnInit {
	isCreatingRoom: boolean = false;
	message: string = "";

	constructor(
		private wsGateway: WSGateway,
		public privChatService: PrivChatService,
		public userService: UserService,
	) {}

	async ngOnInit() {
		await this.privChatService.updateUserInfo();
		this.wsGateway.getAllFriend();
		this.wsGateway.listenAllFriend()
			.subscribe((friends: UserI[]) => {
				console.log("event AllFriend received ");
				console.log("friends", friends);
				this.privChatService.updateAllFriend(friends);
			}
		)

		this.wsGateway.getAllPrivateRoom();
		this.wsGateway.listenAllPrivateRoom()
			.subscribe((rooms: ChatRoomI[]) => {
				console.log("event AllPrivateRoom received")
				this.privChatService.updateAllPrivateRoom(rooms);
			}
		)

		this.wsGateway.getAllPrivateMessage();
		this.wsGateway.listenAllPrivateMessage()
			.subscribe((data: any) => {
				console.log("event AllPrivateMessage received")
				this.privChatService.updateAllPrivateMessage(data);
			}
		)

		this.wsGateway.listenNewPrivateRoom()
			.subscribe((room: ChatRoomI) => {
				console.log("event NewPrivateRoom received")
				this.privChatService.updateNewPrivateRoom(room);
			}
		)

		this.wsGateway.listenNewPrivateMessage()
			.subscribe((data: any) => {
				console.log("event NewPrivateMessage received")
				this.privChatService.updateNewPrivateMessage(data);
			}
		)

		this.wsGateway.listenNewStatusFriend()
			.subscribe((data: any) => {
				console.log("event NewStatusFriend received")
				this.privChatService.updateNewFriendStatus(data);
			}
		)
	}

	onCreateFriend(friend: FriendI) {
		this.privChatService.updateSelectedFriend(friend);

		const	selected_friend = this.privChatService.getSelectedFriend();
		if (selected_friend.user_info.id === -1)
			return ;
		if (this.privChatService.isGoodFriendRoom(selected_friend.room))
		{
			console.log( `[chat] private chat room with ${selected_friend
				.user_info.ftLogin} already created`)
			return ;
		}
		this.wsGateway.createPrivateRoom(selected_friend.user_info.id);
		this.onClosePopup();
	}

	onSelectFriend(friend: FriendI) {
		this.privChatService.updateSelectedFriend(friend);

		const	selected_room = this.privChatService.getSelectedFriendRoom();

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
		this.privChatService.getInfo()
	}

	onPress(event: any)
	{
		if (event.key === "Enter")
			this.sendMessage();
	}

	sendMessage() {
		const selected_room = this.privChatService.getSelectedFriendRoom();

		if (selected_room.id === -1)
			return ;
		this.wsGateway.sendPrivateMessage(selected_room.id, this.message);
		this.message = "";
	}

	isSameUser(i: number): boolean {
		const selected_room = this.privChatService.getSelectedFriendRoom();
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
		const selected_room = this.privChatService.getSelectedFriendRoom();
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
