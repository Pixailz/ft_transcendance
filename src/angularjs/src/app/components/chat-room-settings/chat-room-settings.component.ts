import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pairwise } from 'rxjs';
import { ChatRoomI, RoomType } from 'src/app/interfaces/chat/chat-room.interface';
import { UserI } from 'src/app/interfaces/user/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { ChatChannelFriendListComponent } from '../chat-channel-friend-list/chat-channel-friend-list.component';

@Component({
  selector: 'app-chat-room-settings',
  templateUrl: './chat-room-settings.component.html',
  styleUrls: ['./chat-room-settings.component.scss']
})
export class ChatRoomSettingsComponent {
	room: ChatRoomI = this.data.room;
	roomForm!: FormGroup;
	roomJoinPrivateForm!: FormGroup;
	change_password: Boolean = false;
	remove_password: Boolean = false;
	room_type: RoomType = this.room.type;
	userList:    number[] = [];
	RoomType = RoomType;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public userService: UserService,
		public chatRoomService: ChatRoomService,
		private formBuilder: FormBuilder,
		private wsGateway: WSGateway,
		private dialog: MatDialog,
		private friendService: FriendService,
		private chatChannelService: ChatChannelService,
	) {}

	ngOnInit() {
		if (this.chatRoomService.isOwner(this.room, this.userService.user.id))
		{
			this.roomForm = this.formBuilder.group({
				name: this.room.name,
				password: "",
				is_private: this.room.type === RoomType.PRIVATE,
			});
			this.roomForm.get("password").setValue("");
			this.roomForm.get("password").disable({onlySelf: true});
			this.roomForm.valueChanges
			.subscribe((value) => {
				this.room_type = value.is_private ? RoomType.PRIVATE : this.room.type === RoomType.PRIVATE ? RoomType.PUBLIC : this.room.type;
			});
			this.roomForm.valueChanges
			.pipe(pairwise())
			.subscribe(([prev, next]: [any, any]) => {
				if (prev.is_private != next.is_private)
				{
					if (next.is_private)
					{
						this.roomForm.get("password").setValue("");
						this.roomForm.get("password").disable({onlySelf: true});
					}
					else
						this.roomForm.get("password").enable({onlySelf: true});
				}
			});
		}
	}

	onActiveChangePassword() {
		this.change_password = !this.change_password;
		if (this.change_password) {
			this.roomForm.get("password").enable({onlySelf: true});
			this.remove_password = false;
		} else {
			this.roomForm.get("password").setValue("");
			this.roomForm.get("password").disable({onlySelf: true});
			this.remove_password = true;
		}
	}

	onChange() {
		const data = {
			name: this.roomForm.value.name,
			password: this.roomForm.value.password,
			is_private: this.roomForm.value.is_private,
			remove_pass:  this.remove_password,
			change_private: this.room.type === RoomType.PRIVATE && !this.roomForm.value.is_private
				|| this.room.type !== RoomType.PRIVATE && this.roomForm.value.is_private,
		}
		this.wsGateway.changeRoomDetails(this.room.id, data);
		this.wsGateway.addUserToRoom(this.chatChannelService.getSelectedRoom().id, this.userList);
	}

	addFriends()
    {
		const dialog = this.dialog.open(ChatChannelFriendListComponent, {
			panelClass: ['custom-dialog'],
			data: {friends: this.getManagementAddUser(), friend_added: this.userList},
		});


		dialog.afterClosed().subscribe((value: number[]) => {
			this.userList = value;
		})
    }

	getManagementAddUser(): UserI[]
	{
		const user: UserI[] = this.chatChannelService.getSelectedRoomUser();
		var friend: UserI[] = this.friendService.getFriends();

		for (var i = 0; i < user.length; i++)
		{
			for (var j = 0; j < friend.length; j++)
			{
				if (user[i].id === friend[j].id)
				{
					friend.splice(j, 1);
					continue ;
				}
			}
		}
		return (friend);
	}
}
