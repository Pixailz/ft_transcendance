import { Component } from '@angular/core';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatDmService } from 'src/app/services/websocket/chat/direct-message/service';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { NotificationService } from 'src/app/services/websocket/notification/service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
	constructor (
		private friendService : FriendService,
		private chatDmService : ChatDmService,
		private chatChannelService : ChatChannelService,
		private notificationService : NotificationService,
	)
	{ }

	onGetInfo()
	{
		this.friendService.getInfo();
		this.chatDmService.getInfo();
		this.chatChannelService.getInfo();
		this.notificationService.getInfo();
	}
}
