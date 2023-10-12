import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewDmComponent } from 'src/app/components/new-dm/new-dm.component';
import { MessageContentI } from 'src/app/interfaces/chat/message.inteface';
import { UserService } from 'src/app/services/user.service';
import { ChatDmService } from 'src/app/services/websocket/chat/direct-message/service';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
  selector: 'app-priv-chat-page',
  templateUrl: './priv-chat-page.component.html',
  styleUrls: ['./priv-chat-page.component.scss']
})
export class PrivChatPageComponent {
	constructor(public chatDmService: ChatDmService,
				public friendService: FriendService,
				public userService: UserService,
				private wsGateway: WSGateway,
				private dialog: MatDialog,
	){}

	onSelectFriend(friend: any)
	{
		this.chatDmService.updateSelectedDm(friend);

		const	selected_room = this.chatDmService.getSelectedDm();

		if (!selected_room)
			return ;
	}

	sendMessage(message: MessageContentI) {
		this.wsGateway.sendDmMessage(this.chatDmService.getSelectedDm().room.id, message);
	}

	onNewRoom()
	{
		this.dialog.open(NewDmComponent, {
			panelClass: ['custom-dialog', 'dm-popup'],
			data: {friends: this.chatDmService.getFriends()},
		});
	}
}
