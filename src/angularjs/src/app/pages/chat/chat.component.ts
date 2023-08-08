import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { WSChatService } from 'src/app/services/ws-chat';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	message: string = "";
	user_id: number = -1;
	nickname: string = "";
	room_ids: number[] = [];
	dest_id: number = -1;
	selection: string = "";
	friend_ids: number[] = [];

	constructor(private wsChatService: WSChatService, private userService: UserService) {}

	async ngOnInit() {
		await this.userService.getUserInfo()
			.then((user) => {
				this.user_id = user.id;
				this.nickname = user.nickname;
			})
			.catch((err) => {
				this.user_id = -1;
				this.nickname = "<undifined>";
			});
		if (this.user_id === -1)
		{
			console.log("[WSChatComponent] getUserInfo failed");
			return ;
		}
		this.wsChatService.sendRoomIds(this.user_id);
		this.wsChatService.getRoomIds()
			.subscribe((room_ids: number[]) => {
				this.room_ids = room_ids;
			}
		)
		this.wsChatService.sendFriendIds(this.user_id);
		this.wsChatService.getFriendIds()
			.subscribe((friend_ids: number[]) => {
				this.friend_ids = friend_ids;
			}
		)
		console.log("roomIDS   ", this.room_ids);
		console.log("friendIDS ", this.friend_ids);
	}

	sendMessage() {
		if (!this.message) return ;
		if (!this.dest_id) return ;
		const dest_id: number = Number(this.selection);
		console.log("message ", this.message);
		console.log("dest_id ", dest_id);
		console.log("src_id  ", this.user_id);
		// this.wsChatService.sendMessage(this.user_id, this.message);
		this.wsChatService.sendMessage(this.nickname, this.message);
	}
}
