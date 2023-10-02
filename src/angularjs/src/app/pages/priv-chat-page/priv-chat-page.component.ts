import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';
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
				private wsGateway: WSGateway) {		
	}

	onSelectFriend(friend: any)
	{
		this.chatDmService.updateSelectedDm(friend);

		const	selected_room = this.chatDmService.getSelectedDm();

		if (!selected_room)
			return ;
	}

	sendMessage(message: string) {
		this.wsGateway.sendDmMessage(this.chatDmService.getSelectedDm().room.id, message);
	}
}
