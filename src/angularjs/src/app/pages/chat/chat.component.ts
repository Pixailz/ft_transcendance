import { Component, OnInit } from '@angular/core';
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
	user_id: number = -1;
	nickname: string = "";
	room_ids: number[] = [];

	constructor(private wsChatService: WSChatService, private userService: UserService) {}

	async ngOnInit() {
		await this.userService.getUserInfo()
			.then((user) => {
				this.user_id = user.id;
				this.nickname = user.nickname;
			})
			.catch((err) => {
				this.user_id = -1;
			});
		if (this.user_id === -1)
		{
			console.log("[WSChatComponent] getUserInfo failed");
			return ;
		}
		await this.userService.getRoomIds()
			.then((roomIds: number[]) => {
				this.room_ids = roomIds;
			})
			.catch((err) => {
				this.room_ids = [];
			});
		console.log("roomIDS ", this.room_ids);
		return this.wsChatService.getNewMessage()
			.subscribe((message: string) => {
					this.messages.push(message)
				}
			)
	}

	onSubmit() {
		if (!this.message) return ;
		// this.wsChatService.sendMessage(this.user_id, this.message);
		this.wsChatService.sendMessage(this.nickname, this.message);
	}
}
