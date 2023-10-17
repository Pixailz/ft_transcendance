import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatRoomSettingsComponent } from 'src/app/components/chat-room-settings/chat-room-settings.component';
import { JoinChatRoomComponent } from 'src/app/components/join-chat-room/join-chat-room.component';
import { NewChatRoomComponent } from 'src/app/components/new-chat-room/new-chat-room.component';
import { ChatRoomI } from 'src/app/interfaces/chat/chat-room.interface';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';

@Component({
	selector: 'app-chat-page',
	templateUrl: './chat-page.component.html',
	styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
	constructor(
		public chatChannelService: ChatChannelService,
		public chatRoomService: ChatRoomService,
		private dialog: MatDialog,
	) {}

	onSelectRoom(room: ChatRoomI)
	{
		this.chatChannelService.updateSelectedRoom(room);
		const	selected_room = this.chatChannelService.getSelectedRoom();
		if (!selected_room)
			return ;
	}

	onNewRoom()
	{
		this.dialog.open(NewChatRoomComponent, {
			panelClass: ['custom-dialog', 'chat-room-popup'],
			data: {},
		});
	}

	onJoinRoom()
	{
		this.dialog.open(JoinChatRoomComponent, {
			panelClass: ['custom-dialog'],
			data: {},
		});
	}

	onModifyChatRoom(room: ChatRoomI)
	{
		this.dialog.open(ChatRoomSettingsComponent, {
			panelClass: ["custom-dialog"],
			data: {room: room},
		});
	}
}
