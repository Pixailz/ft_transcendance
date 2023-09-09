import { Component, OnInit } from '@angular/core';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { UserService } from 'src/app/services/user.service';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomAction } from 'src/app/interfaces/chat-channel.interface';
import { ChatRoomI, RoomType } from 'src/app/interfaces/chat-room.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { FriendService } from 'src/app/services/websocket/friend/service';
import { ChatDmService } from 'src/app/services/websocket/chat/direct-message/service';

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

	constructor(
		private wsGateway: WSGateway,
		public chatDmService: ChatDmService,
		public chatChannelService: ChatChannelService,
		public chatRoomService: ChatRoomService,
		public userService: UserService,
		private formBuilder: FormBuilder,
	) {}

	ngOnInit() {
		this.roomCreateForm = this.formBuilder.group({
			roomName: "",
			password: "",
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
	{
		console.log(user);
	}

	onMuteUser(user: UserI)
	{
		console.log(user);
	}


	onPromoteUser(user: UserI)
	{ this.onRoomAction(RoomAction.PROMOTE, user.id); }


	onGiveKrownUser(user: UserI)
	{ this.onRoomAction(RoomAction.OWNERSHIP, user.id); }


	onGetInfo()
	{ this.chatChannelService.getInfo(); }

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

	canChangeRoomDetails()
	{ return (this.chatChannelService.isOwnerSelectedRoom()); }

	canGiveKrownUser()
	{ return (this.chatChannelService.isOwnerSelectedRoom()); }

	canPromoteUser()
	{ return (this.chatChannelService.isOwnerSelectedRoom()); }

	canKickUser()
	{ return (this.chatChannelService.isOwnerSelectedRoom() ||
								this.chatChannelService.isAdminSelectedRoom()); }

	canBanUser()
	{ return (this.chatChannelService.isOwnerSelectedRoom() ||
								this.chatChannelService.isAdminSelectedRoom()); }

	canMuteUser()
	{ return (this.chatChannelService.isOwnerSelectedRoom() ||
								this.chatChannelService.isAdminSelectedRoom()); }


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
