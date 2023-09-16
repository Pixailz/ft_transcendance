import { Component, OnInit } from '@angular/core';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomAction } from 'src/app/interfaces/chats/chat-channel.interface';
import { ChatRoomI, RoomType } from 'src/app/interfaces/chats/chat-room.interface';
import { UserI } from 'src/app/interfaces/user/user.interface';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatDmService } from 'src/app/services/websocket/chat/direct-message/service';
import { FriendService } from 'src/app/services/websocket/friend/service';

@Component({
	selector: 'app-chat-channel',
	templateUrl: './chat-channel.component.html',
	styleUrls: ['./chat-channel.component.scss'],
})
export class WSChatChannelComponent implements OnInit {
	popupType: string = "closed";
	message: string = "";
	roomCreateForm!: FormGroup;
	roomCreateFriends!: FormGroup;
	roomJoinPrivateForm!: FormGroup;
	roomManagementDetails!: FormGroup;
	roomManagementUser!: FormGroup;
	joinSelectedRoom: string = "-1";
	muted_time: number = 0;

	constructor(
		private wsGateway: WSGateway,
		public chatDmService: ChatDmService,
		public chatChannelService: ChatChannelService,
		public chatRoomService: ChatRoomService,
		public friendService: FriendService,
		public userService: UserService,
		private formBuilder: FormBuilder,
	) {}

	ngOnInit() {
		this.roomCreateForm = this.formBuilder.group({
			roomName: "",
			password: "",
			is_private: false,
		}, { updateOn: "change" });

		this.roomCreateFriends = this.formBuilder.group({
			user: [],
		}, { updateOn: "change" });

		this.roomJoinPrivateForm = this.formBuilder.group({
			password: "",
		}, { updateOn: "change" });

		this.roomManagementDetails = this.formBuilder.group({
			name: "",
			password: "",
			remove_pass: false,
			change_private: false,
			is_private: false,
		}, { updateOn: "change" });

		this.roomManagementUser = this.formBuilder.group({
			user: [],
		}, { updateOn: "change" });

	}

	onSelectRoom(room: ChatRoomI)
	{
		this.chatChannelService.updateSelectedRoom(room);

		const	selected_room = this.chatChannelService.getSelectedRoom();

		if (!selected_room)
			return ;
	}

	onCreate()
	{
		let user_list: number[] = [];

		if (!this.roomCreateForm.valid || !this.roomCreateFriends.valid)
			return ;
		if (this.roomCreateFriends.dirty)
			for (let i = 0; i < this.roomCreateFriends.value.user.length; i++)
				user_list.push(this.roomCreateFriends.value.user[i].id);
		this.wsGateway.createChannelRoom(
			this.roomCreateForm.value.roomName,
			this.roomCreateForm.value.password,
			this.roomCreateForm.value.is_private,
			user_list
		);
		this.onClearCreate();
	}

	onJoin()
	{
		const selected_room = this.getJoinSelected();

		if (selected_room.type === RoomType.PROTECTED)
			if (!this.roomJoinPrivateForm.valid)
				return ;
		this.wsGateway.joinChannelRoom(
			selected_room.id, this.roomJoinPrivateForm.value.password
		);
		this.onClearJoin();
		this.joinSelectedRoom = "-1";
	}

	onChangeRoomDetails()
	{
		const selected_room = this.chatChannelService.getSelectedRoom();

		if (selected_room.id === -1 ||
			!this.roomManagementDetails.valid ||
			!this.roomManagementDetails.value) return ;
		this.wsGateway.changeRoomDetails(selected_room.id, this.roomManagementDetails.value);
	}

	onAddUser()
	{
		if (!this.roomManagementUser.value ||
			!this.roomManagementUser.value.user ||
			!this.roomManagementUser.value.user.length)
			return ;
		const user_id: number[] = [];
		for (var user of this.roomManagementUser.value.user)
			user_id.push(user.id);
		this.wsGateway.addUserToRoom(this.chatChannelService.getSelectedRoom().id, user_id);
		this.onClearManagementUser();
	}

	onLeave()
	{ this.wsGateway.leaveRoom(this.chatChannelService.getSelectedRoom().id, this.userService.user.id); }

	onRoomAction(action: RoomAction, target_id: number)
	{
		const selected_room = this.chatChannelService.getSelectedRoom();

		if (selected_room.id === -1 ||
			!this.roomManagementDetails.valid ||
			!this.roomManagementDetails.value) return ;
		this.wsGateway.roomAction(selected_room.id, action, target_id);
	}

	onKickUser(user: UserI)
	{ this.onRoomAction(RoomAction.KICK, user.id); }

	onBanUser(user: UserI)
	{ this.onRoomAction(RoomAction.BAN, user.id); }

	onUnBanUser(user: UserI)
	{ this.onRoomAction(RoomAction.UNBAN, user.id); }

	onPromoteUser(user: UserI)
	{ this.onRoomAction(RoomAction.PROMOTE, user.id); }

	onDemoteUser(user: UserI)
	{ this.onRoomAction(RoomAction.DEMOTE, user.id); }

	onGiveKrownUser(user: UserI)
	{ this.onRoomAction(RoomAction.OWNERSHIP, user.id); }

	onUnmuteUser(user: UserI)
	{ this.onRoomAction(RoomAction.UNMUTE, user.id); }

	onMuteUser(user: UserI)
	{
		const selected_room = this.chatChannelService.getSelectedRoom();

		if (selected_room.id === -1 ||
			!this.roomManagementDetails.valid ||
			!this.roomManagementDetails.value ||
			!this.muted_time) return ;
		this.wsGateway.channelMute(selected_room.id, user.id, this.muted_time);
	}

	onCreatingRoom()
	{ this.popupType = "create-join"; }

	onClosePopup()
	{ this.popupType = "closed"; this.onClearAll(); }

	onPress(event: any)
	{ if (event.key === "Enter") this.sendMessage(); }

	onClearAll()
	{ this.onClearCreate(); this.onClearJoin(); }

	onClearCreate()
	{ this.onClearCreateDetails(); this.onClearFriend(); }

	onClearManagement()
	{ this.onClearManagementDetails(); this.onClearManagementUser(); }

	onClearCreateDetails()
	{ this.clearForm(this.roomCreateForm); }

	onClearFriend()
	{ this.clearForm(this.roomCreateFriends); }

	onClearJoin()
	{ this.clearForm(this.roomJoinPrivateForm); }

	onClearManagementDetails()
	{ this.clearForm(this.roomManagementDetails); }

	onClearManagementUser()
	{ this.clearForm(this.roomManagementUser); }

	onOpenManagement()
	{ this.popupType = "management"; }

	clearForm(form: FormGroup)
	{ form.reset(); }


	getJoinSelected()
	{ return (this.chatChannelService.getJoinSelected(this.joinSelectedRoom)); }

	getJoinUser()
	{ return (this.chatChannelService.getJoinUser(this.joinSelectedRoom)); }

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

	getCreateFriendUser(): UserI[]
	{
		if (this.roomCreateFriends.status !== "VALID")
			return ([]);
		return (this.roomCreateFriends.value.user);
	}

	sendMessage() {
		this.chatChannelService.sendMessage(this.message);
		this.message = "";
	}

	canChangeRoomDetails(): boolean
	{ return (this.chatChannelService.isOwnerSelectedRoom()); }

	canGiveKrownUser(): boolean
	{ return (this.chatChannelService.isOwnerSelectedRoom()); }

	canPromoteUser(): boolean
	{ return (this.chatChannelService.isOwnerSelectedRoom()); }

	canKickUser(target: UserI): boolean
	{
		var can: boolean = false;

		if (this.chatChannelService.isOwnerSelectedRoom() ||
								this.chatChannelService.isAdminSelectedRoom())
			can = true;
		if (this.chatChannelService.getOwner().id === target.id)
			can = false;
		return (can);
	}

	canBanUser(target: UserI): boolean
	{
		var can: boolean = false;

		if (this.chatChannelService.isOwnerSelectedRoom() ||
								this.chatChannelService.isAdminSelectedRoom())
			can = true;
		if (this.chatChannelService.getOwner().id === target.id)
			can = false;
		return (can);
	}

	canMuteUser(target: UserI): boolean
	{
		var can: boolean = false;

		if (this.chatChannelService.isOwnerSelectedRoom() ||
								this.chatChannelService.isAdminSelectedRoom())
			can = true;
		if (this.chatChannelService.getOwner().id === target.id)
			can = false;
		return (can);
	}


	isFollowingDay(i: number): boolean {
		const selected_room = this.chatChannelService.getSelectedRoom();
		if (selected_room.id === -1)
			return (false);

		const message_len = selected_room.message.length;

		if (!selected_room.message[message_len - i - 2] ||
			selected_room.message[message_len - i - 2].id === -1 ||
			selected_room.message[message_len - i - 2].id === -1)
			return (false);
		if (selected_room.message[message_len - i - 2].updateAt?.toString().split('T')[0] !== selected_room.message[message_len - i - 1].updateAt?.toString().split('T')[0])
			return (false);
		return (true);
	}
}
