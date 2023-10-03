import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatRoomI } from 'src/app/interfaces/chat-room.interface';
import { MessageI } from 'src/app/interfaces/message.inteface';
import { UserI } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
	selector: 'app-chat-view',
	templateUrl: './chat-view.component.html',
	styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent {
	messageLength: number = 0;
	messageForm!: FormGroup;

	@Input() room!: ChatRoomI;
    @Output() sendMessageEmitter = new EventEmitter<string>();


	constructor(
		private formBuilder: FormBuilder,
		private chatRoomService: ChatRoomService,
		public userService: UserService,
		private wsGateway: WSGateway
	) {}

	async ngOnInit() {
		this.messageForm = this.formBuilder.group({
			message: ""
		}, { updateOn: "change" });

		this.messageForm.get('message')!.valueChanges
		.subscribe((value: any) => {
			this.messageLength = value.length;
		});
	}

	getCurrentMessageUser(i: number): UserI
	{
		return (this.getCurrentMessage(i).user);
	}

	getCurrentMessage(i: number): MessageI
	{ return (this.chatRoomService.getCurrentMessage(this.room, i)); }

	isSameUser(i: number): boolean {
		if (this.room.id === -1)
			return (false);

		const message_len = this.room.message.length;
		if (!this.room.message[message_len - i - 2] ||
			this.room.message[message_len - i - 2].id === -1 ||
			this.room.message[message_len - i - 2].id === -1)
			return (false);
		if (this.room.message[message_len - i - 2].userId !== this.room.message[message_len - i - 1].userId)
			return (false);
		return (true);
	}

	isFollowingDay(i: number): boolean {
		const message_len = this.room.message.length;

		if (!this.room.message[message_len - i - 2] ||
			this.room.message[message_len - i - 2].id === -1 ||
			this.room.message[message_len - i - 2].id === -1)
			return (false);
		if (this.room.message[message_len - i - 2].updateAt?.toString().split('T')[0] !== this.room.message[message_len - i - 1].updateAt?.toString().split('T')[0])
			return (false);
		return (true);
	}

	sendMessage() {
		if (!this.messageForm.value.message.length)
			return ;
		this.sendMessageEmitter.emit(this.messageForm.value.message);
		this.messageForm.patchValue({
			message: "",
		});
	}
}
