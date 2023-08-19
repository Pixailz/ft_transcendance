import { Component, OnInit } from '@angular/core';
import {
	UserI,
	Status,
	ChatRoomI,
	FriendI,
} from 'src/app/interfaces/chat.interface';
import { WSChatGateway } from 'src/app/services/ws-chat.gateway';
import { ChatService } from 'src/app/services/chat.service';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	isCreatingRoom: boolean = false;
	message: string = "";

	constructor(
		private wsChatGateway: WSChatGateway,
		public chatService: ChatService,
	) {}

	async ngOnInit() {
		await this.chatService.updateUserInfo();
		this.wsChatGateway.getAllFriend();
		this.wsChatGateway.listenAllFriend()
			.subscribe((friends: UserI[]) => {
				console.log("event AllFriend received ");
				this.chatService.updateAllFriend(friends);
			}
		)

		this.wsChatGateway.getAllPrivateRoom();
		this.wsChatGateway.listenAllPrivateRoom()
			.subscribe((data: ChatRoomI[]) => {
				console.log("event AllPrivateRoom received")
				this.chatService.updateAllPrivateRoom(data);
			}
		)

		this.wsChatGateway.getAllPrivateMessage();
		this.wsChatGateway.listenAllPrivateMessage()
			.subscribe((data: any) => {
				console.log("event AllPrivateMessage received")
				this.chatService.updateAllPrivateMessage(data);
			}
		)

		this.wsChatGateway.listenNewPrivateRoom()
			.subscribe((data: ChatRoomI) => {
				console.log("event NewPrivateRoom received")
				this.chatService.updateNewPrivateRoom(data);
			}
		)

		this.wsChatGateway.listenNewPrivateMessage()
			.subscribe((data: any) => {
				console.log("event NewPrivateMessage received")
				this.chatService.updateNewPrivateMessage(data);
			}
		)

		this.wsChatGateway.listenNewStatusFriend()
			.subscribe((friends_status: any) => {
				console.log("event NewStatusFriend received")
				this.chatService.updateNewFriendStatus(friends_status);
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
		this.wsChatGateway.createPrivateRoom(selected_friend.user_info.id);
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

	getFriendInfo(friend: FriendI | undefined)
	{
		if (!friend)
			return "";
		var	tmp;
		switch (friend.user_info.status) {
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
		tmp += friend.user_info.ftLogin + " ";
		if (friend.user_info.nickname)
			tmp += ` (${friend.user_info.nickname})`
		return (tmp);
	}

	sendMessage() {
		const selected_room = this.chatService.getSelectedFriendRoom();

		if (selected_room.id === -1)
			return ;
		this.wsChatGateway.sendPrivateMessage(selected_room.id, this.message);
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
