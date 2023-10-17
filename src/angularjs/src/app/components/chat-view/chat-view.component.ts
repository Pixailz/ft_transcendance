import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatRoomI } from 'src/app/interfaces/chat/chat-room.interface';
import { MessageContentI, MessageContentType, MessageI } from 'src/app/interfaces/chat/message.inteface';
import { UserI } from 'src/app/interfaces/user/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';

@Component({
	selector: 'app-chat-view',
	templateUrl: './chat-view.component.html',
	styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent {
	messageLength: number = 0;
	messageForm!: FormGroup;

	messageType: MessageContentType = MessageContentType.STRING;
	displaySpecialMessage: boolean = false;

	@Input() blocked: boolean = false;
	@Input() room!: ChatRoomI;
	@Output() sendMessageEmitter = new EventEmitter<MessageContentI[]>();

	constructor(
		private formBuilder: FormBuilder,
		private chatRoomService: ChatRoomService,
		public router: Router,
		public userService: UserService,
	) {}

	async ngOnInit() {
		this.messageForm = this.formBuilder.group({
			type: MessageContentType.STRING,
			string: "",
			gameInvite: "",
		}, { updateOn: "change" });
		this.activateString();
		this.messageForm!.valueChanges
		.subscribe((value: any) => {
			switch (this.messageForm.value.type)
			{
				case (MessageContentType.STRING): {
					this.messageLength = value?.string.length;
					break;
				}
				case (MessageContentType.GAME_INVITE): {
					this.messageLength = value?.gameInvite.length;
					break;
				}
			}
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
		if (this.blocked)
			return ;
		const message_content: MessageContentI[] = [];
		if (this.messageForm.value.string?.length)
		{
			message_content.push({
				type: MessageContentType.STRING,
				content: this.messageForm.value.string,
			})
		}
		if (this.messageForm.value.gameInvite?.length)
		{
			message_content.push({
				type: MessageContentType.GAME_INVITE,
				content: this.messageForm.value.gameInvite,
			})
		}
		if (!message_content.length)
			return ;
		this.sendMessageEmitter.emit(message_content);
		this.messageForm.setValue({
			type: MessageContentType.STRING,
			string: "",
			gameInvite: "",
		});
	}

	specialMessage()
	{
		this.displaySpecialMessage = !this.displaySpecialMessage;
	}

	activateString()
	{
		this.messageForm.patchValue({
			type: MessageContentType.STRING,
		});
	}

	activateGameInvite()
	{
		this.messageForm.patchValue({
			type: MessageContentType.GAME_INVITE,
		});
	}

	joinGame(room_id: string)
	{ this.router.navigate(["/play", room_id], { replaceUrl: true }); }
}
