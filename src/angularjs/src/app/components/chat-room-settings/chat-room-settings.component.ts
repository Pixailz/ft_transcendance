import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatRoomI } from 'src/app/interfaces/chat/chat-room.interface';
import { UserService } from 'src/app/services/user.service';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
  selector: 'app-chat-room-settings',
  templateUrl: './chat-room-settings.component.html',
  styleUrls: ['./chat-room-settings.component.scss']
})
export class ChatRoomSettingsComponent {
  room: ChatRoomI = this.data.room;
  roomForm!: FormGroup;
	roomJoinPrivateForm!: FormGroup;


	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UserService,
    public chatRoomService: ChatRoomService,
    private formBuilder: FormBuilder,
		private wsGateway: WSGateway,
	) {}

  ngOnInit() {
    if (this.chatRoomService.isOwner(this.room, this.userService.user.id))
    {
      this.roomForm = this.formBuilder.group({
        name: this.room.name,
        password: "",
        is_private: false,
      });

    }
  }

  onChange() {
    const data = {
      name: this.roomForm.value.name,
      password: this.roomForm.value.password,
      is_private: this.roomForm.value.is_private,
			remove_pass: false,
			change_private: false,
    }
    this.wsGateway.changeRoomDetails(this.room.id, data);
  }
}
