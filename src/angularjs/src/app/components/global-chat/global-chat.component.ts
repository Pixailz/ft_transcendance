import { Component, OnInit } from '@angular/core';
import { WSGateway } from 'src/app/services/ws.gateway';
import { UserService } from 'src/app/services/user.service';
import { GlobChatService } from './global-chat.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatRoomI, RoomType, UserChatRoomI, UserI } from 'src/app/interfaces/chat.interface';
import { PrivChatService } from '../../pages/priv-chat/priv-chat.service';
import { RoomAction } from './global-chat.interface';

@Component({
	selector: 'app-global-chat',
	templateUrl: './global-chat.component.html',
	styleUrls: ['./global-chat.component.scss'],
})
export class WSGlobChatComponent implements OnInit {
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
		public globChatService: GlobChatService,
		public userService: UserService,
		private formBuilder: FormBuilder,
		public privChatService: PrivChatService,
	) {}

	async ngOnInit() {
		await this.globChatService.updateUserInfo();
		await this.privChatService.updateUserInfo();

		this.wsGateway.listenGetGlobalChatRoom().subscribe((data: ChatRoomI) => {
			console.log("event GlobalChatRoom received");
			this.globChatService.updateSelectedRoom(data);
			this.wsGateway.joinGlobalRoom(data.id, "");
		});
		this.wsGateway.getGlobalChatRoom();

		this.wsGateway.listenNewGlobalMessage().subscribe((data: any) => {
			console.log("event getNewGlobalMessage received");
			this.globChatService.updateNewGlobalMessage(data);
		});

		// this.wsGateway.listenNewUserJoinGlobalRoom().subscribe((data: UserChatRoomI) => {
		// 	console.log("event NewUserJoinGlobalRoom received");
		// 	this.globChatService.updateNewUserJoinGlobalRoom(data);
		// })

		this.wsGateway.listenNewDetailsGlobalRoom().subscribe((data: ChatRoomI) => {
			console.log("event NewDetailsGlobalRoom received");
			this.globChatService.updateNewDetailsGlobalRoom(data);
		})

		this.wsGateway.listenRoomAction().subscribe((data: any) => {
			console.log("event RoomAction");
			this.globChatService.updateRoomAction(data);
		})

		this.wsGateway.listenNewJoinedGlobalRoom().subscribe((data: ChatRoomI) => {
			console.log("event NewJoinedGlobalRoom received");
			this.globChatService.updateNewJoinedGlobalRoom(data);
		})

		
		// this.wsGateway.getAllFriend();
		// this.wsGateway.listenAllFriend()
		// 	.subscribe((friends: UserI[]) => {
		// 		console.log("event AllFriend received ");
		// 		this.privChatService.updateAllFriend(friends);
		// 	}
		// )

		// this.wsGateway.listenNewStatusFriend()
		// 	.subscribe((data: any) => {
		// 		console.log("event NewStatusFriend received")
		// 		this.privChatService.updateNewFriendStatus(data);
		// 	}
		// )

		// this.roomCreateForm = this.formBuilder.group({
		// 	roomName: "",
		// 	password: "",
		// }, { updateOn: "change" });

		// this.roomCreateFriends = this.formBuilder.group({
		// 	user: [],
		// }, { updateOn: "change" });

		// this.roomJoinPrivateForm = this.formBuilder.group({
		// 	password: "",
		// }, { updateOn: "change" });

		// this.roomManagementDetails = this.formBuilder.group({
		// 	name: "",
		// 	password: "",
		// 	remove_pass: false,
		// }, { updateOn: "change" });

		// this.roomManagementUser = this.formBuilder.group({
		// 	user: [],
		// }, { updateOn: "change" });

		// this.wsGateway.getAllAvailableGlobalRoom();
		// this.wsGateway.listenAllAvailableGlobalRoom().subscribe((data: ChatRoomI[]) => {
		// 	console.log("event AllAvailableGlobalRoom received");
		// 	this.globChatService.updateAllAvailableGlobalRoom(data);
		// })

		// this.wsGateway.listenNewAvailableGlobalRoom().subscribe((data: ChatRoomI) => {
		// 	console.log("event NewAvailableGlobalRoom received");
		// 	this.globChatService.updateNewAvailableGlobalRoom(data);
		// })

		// this.wsGateway.getAllJoinedGlobalRoom();
		// this.wsGateway.listenAllJoinedGlobalRoom().subscribe((data: ChatRoomI[]) => {
		// 	console.log("event AllJoinedGlobalRoom received");
		// 	this.globChatService.updateAllJoinedGlobalRoom(data);
		// })
	}

	onSelectRoom(room: ChatRoomI)
	{
		this.globChatService.updateSelectedRoom(room);

		const	selected_room = this.globChatService.getSelectedRoom();

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
		this.wsGateway.createGlobalRoom(
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
		this.wsGateway.joinGlobalRoom(
			selected_room.id, this.roomJoinPrivateForm.value.password
		);
		this.onClearJoin();
		this.joinSelectedRoom = "-1";
	}

	onChangeRoomDetails()
	{
		const selected_room = this.globChatService.getSelectedRoom();

		if (selected_room.id === -1 ||
			!this.roomManagementDetails.valid ||
			!this.roomManagementDetails.value) return ;
		this.wsGateway.changeRoomDetails(selected_room.id, this.roomManagementDetails.value);
	}

	canChangeRoomDetails()
	{ return (this.globChatService.isOwnerSelectedRoom()); }


	doRoomAction(action: RoomAction, target_id: number)
	{
		const selected_room = this.globChatService.getSelectedRoom();

		if (selected_room.id === -1 ||
			!this.roomManagementDetails.valid ||
			!this.roomManagementDetails.value) return ;
		this.wsGateway.roomAction(selected_room.id, action, target_id);
	}

	onKickUser(user: UserI)
	{ this.doRoomAction(RoomAction.KICK, user.id); }

	canKickUser()
	{ return (this.globChatService.isOwnerSelectedRoom() ||
								this.globChatService.isAdminSelectedRoom()); }


	onBanUser(user: UserI)
	{
		console.log(user);
	}

	canBanUser()
	{ return (this.globChatService.isOwnerSelectedRoom() ||
								this.globChatService.isAdminSelectedRoom()); }

	onMuteUser(user: UserI)
	{
		console.log(user);
	}

	canMuteUser()
	{ return (this.globChatService.isOwnerSelectedRoom() ||
								this.globChatService.isAdminSelectedRoom()); }


	onPromoteUser(user: UserI)
	{ this.doRoomAction(RoomAction.PROMOTE, user.id); }

	canPromoteUser()
	{ return (this.globChatService.isOwnerSelectedRoom()); }


	onGiveKrownUser(user: UserI)
	{ this.doRoomAction(RoomAction.OWNERSHIP, user.id); }

	canGiveKrownUser()
	{ return (this.globChatService.isOwnerSelectedRoom()); }


	onGetInfo()
	{ this.globChatService.getInfo(); }

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

	clearForm(form: FormGroup)
	{ form.reset(); }

	onOpenManagement()
	{ this.popupType = "management"; }


	getJoinSelected()
	{ return (this.globChatService.getJoinSelected(this.joinSelectedRoom)); }

	getJoinUser()
	{ return (this.globChatService.getJoinUser(this.joinSelectedRoom)); }

	getCreateFriendUser(): UserI[]
	{
		if (this.roomCreateFriends.status !== "VALID")
			return ([]);
		return (this.roomCreateFriends.value.user);
	}

	sendMessage() {
		const selected_room = this.globChatService.getSelectedRoom();

		if (selected_room.id === -1)
			return ;
		this.wsGateway.sendGlobalMessage(selected_room.id, this.message);
		this.message = "";
	}


	isSameUser(i: number): boolean {
		const selected_room = this.globChatService.getSelectedRoom();
		if (selected_room.id === -1)
			return (false);

		const message_len = selected_room.message.length;

		if (!selected_room.message[message_len - i - 2] ||
			selected_room.message[message_len - i - 2].id === -1 ||
			selected_room.message[message_len - i - 2].id === -1)
			return (false);
		if (selected_room.message[message_len - i - 2].userId !== selected_room.message[message_len - i - 1].userId)
			return (false);
		return (true);
	}

	isFollowingDay(i: number): boolean {
		const selected_room = this.globChatService.getSelectedRoom();
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
