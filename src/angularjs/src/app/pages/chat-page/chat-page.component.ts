import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatRoomSettingsComponent } from 'src/app/components/chat-room-settings/chat-room-settings.component';
import { JoinChatRoomComponent } from 'src/app/components/join-chat-room/join-chat-room.component';
import { NewChatRoomComponent } from 'src/app/components/new-chat-room/new-chat-room.component';
import { RoomAction } from 'src/app/interfaces/chat/channel.interface';
import { ChatRoomI } from 'src/app/interfaces/chat/chat-room.interface';
import { UserI } from 'src/app/interfaces/user/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
	selector: 'app-chat-page',
	templateUrl: './chat-page.component.html',
	styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
	constructor(
		public chatChannelService: ChatChannelService,
		public chatRoomService: ChatRoomService,
		public userService: UserService,
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
