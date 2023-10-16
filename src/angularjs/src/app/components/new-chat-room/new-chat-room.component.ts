import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { pairwise } from 'rxjs';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { ChatChannelFriendListComponent } from '../chat-channel-friend-list/chat-channel-friend-list.component';

@Component({
  selector: 'app-new-chat-room',
  templateUrl: './new-chat-room.component.html',
  styleUrls: ['./new-chat-room.component.scss']
})
export class NewChatRoomComponent {

  newRoomForm!: FormGroup;
  userList:    number[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private wsGateway: WSGateway,
    private dialogRef: MatDialogRef<NewChatRoomComponent>,
	private dialog: MatDialog,
	private friendService: FriendService,
    ){}

    ngOnInit() {
      this.newRoomForm = this.formBuilder.group({
        name: "",
        password: "",
        isPrivate: false,
      });
      
      this.newRoomForm.valueChanges
      
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
            if (prev.isPrivate != next.isPrivate)
            {
              if (next.isPrivate)
              {
                this.newRoomForm.get("password").setValue("");
                this.newRoomForm.get("password").disable({onlySelf: true});
              }
              else
                this.newRoomForm.get("password").enable({onlySelf: true});
            }
      });
    }

    onCreate()
    {
      if (!this.newRoomForm.valid)
        return ;
      this.wsGateway.createChannelRoom(
        this.newRoomForm.value.name,
        this.newRoomForm.value.password,
        this.newRoomForm.value.isPrivate,
        this.userList
      );
      this.dialogRef.close();
    }

	addFriends()
    {
		const dialog = this.dialog.open(ChatChannelFriendListComponent, {
			panelClass: ['custom-dialog'],
			data: {friends: this.friendService.getFriends(), friend_added: this.userList},
		});


		dialog.afterClosed().subscribe((value: number[]) => {
			this.userList = value;
		})
    }
}
