import { Component, OnInit } from '@angular/core';
import { WSChatService } from 'src/app/services/ws-chat';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class WSChatComponent implements OnInit {
	chatrooms = [{title: 'Chatroom 1'}, {title: 'Chatroom 2'}]
	crtChatroomId = 0;


	messages: string[] = [];
	message: string = "";

	constructor(private wsChatService: WSChatService) {}

	ngOnInit() {
		return this.wsChatService.getNewMessage()
			.subscribe((message: string) => {
					this.messages.push(message)
				}
			)
	}

	onSubmit() {
		if (!this.message) return ;
		this.wsChatService.sendMessage(this.message);
	}


	onSelectChatroom(i:number) {
		this.crtChatroomId = i;
	}
}
