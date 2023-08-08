import { Component, OnInit } from '@angular/core';
import { ChatRoomI, UserI } from 'src/app/services/interface';
import { UserService } from 'src/app/services/user.service';
import { WSChatService } from 'src/app/services/ws-chat';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	messages: string[] = [];
	message: string = "";
	room_ids: number[] = [];
	user: UserI | undefined = undefined;
	dest: UserI | undefined = undefined;
	selected_room: ChatRoomI | undefined = undefined;
	rooms: ChatRoomI[] = [];
	friends: UserI[] = [];

	constructor(private wsChatService: WSChatService, private userService: UserService) {}

	async ngOnInit() {
		await this.userService.getUserInfo()
			.then((user) => {
				this.user = user;
			})
			.catch((err) => {
				this.user = {id: -1};
			});
		if (!this.user)
		{
			console.log("[WSChatComponent] getUserInfo failed");
			return ;
		}
		this.wsChatService.sendRoomIds(this.user.id);
		this.wsChatService.getRoomIds()
			.subscribe((room_ids: number[]) => {
				this.room_ids = room_ids;
			}
		)
		this.wsChatService.sendFriendIds(this.user.id);
		this.wsChatService.getFriendIds()
			.subscribe((friends: UserI[]) => {
				this.friends = friends;
			}
		)
	}

	sendMessage(message: string) {
		if (!this.message) return ;
		if (!this.dest) return ;
		console.log("message ", this.message);
		console.log("dest_id ", this.dest);
		console.log("src_id  ", this.user);
		// this.wsChatService.sendMessage(this.user_id, this.message);
		// this.wsChatService.sendMessage(this.nickname, this.message);
	}

	onSelectFriend(friend: UserI) {
		this.dest = friend;
		console.log("roomIDS   ", this.rooms);
		console.log("friendIDS ", this.dest);
	}

	onSelectChatroom(room: ChatRoomI) {
		this.selected_room = room;
		console.log("roomIDS   ", this.room_ids);
		console.log("friendIDS ", this.friends);
	}
}
