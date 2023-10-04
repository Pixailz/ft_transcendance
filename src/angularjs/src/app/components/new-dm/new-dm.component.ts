import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserI } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { ChatDmService } from 'src/app/services/websocket/chat/direct-message/service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
  selector: 'app-new-dm',
  templateUrl: './new-dm.component.html',
  styleUrls: ['./new-dm.component.scss']
})
export class NewDmComponent {

  friends: any[] = this.data.friends;

  constructor(
      public userService: UserService,
      private chatDmService: ChatDmService,
      private chatRoomService: ChatRoomService,
      private dialogRef: MatDialogRef<NewDmComponent>,
      private wsGateway: WSGateway,
      @Inject(MAT_DIALOG_DATA) public data: any
  ){}


	onCreateDm(friend: any) {
		this.chatDmService.updateSelectedDm(friend);
		if (friend.room.id === -1)
			return ;
		if (this.chatRoomService.isGoodFullRoom(friend.room))
		{
			console.log( `[chat] dm chat room with ${friend.user_info.ftLogin} already created`)
			return ;
		}
		this.wsGateway.createDmRoom(friend.user_info.id);
    this.dialogRef.close();
  }
}
