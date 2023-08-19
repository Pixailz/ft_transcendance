export enum Status {
	DISCONNECTED,
	CONNECTED,
	AWAY,
}

export interface UserI {
	id					: number;
	ftLogin?			: string;
	nickname			: string;
	picture?			: string;
	email?				: string;
	status?				: number;
	twoAuthFactor?		: boolean;
	lastSeen			: Date;
}

export const DefUserI: UserI = {
	id					: -1,
	nickname			: "",
	lastSeen			: new Date(Date.now()),
}

export interface MessageI {
	id					: number;
	roomId?				: number;
	userId				: number;
	user?				: UserI;
	room?				: ChatRoomI;
	content?			: string;
	updateAt?			: Date;
}

export const DefMessageI: MessageI = {
	id					: -1,
	userId				: -1,
}

export interface ChatRoomI {
	id					: number;
	name?				: string;
	type?				: string;
	password?			: string;
	user				: UserI;
	roomInfo?			: UserChatRoomI[];
	message				: MessageI[];
}

export const DefChatRoomI: ChatRoomI = {
	id					: -1,
	user				: DefUserI,
	message				: Array(DefMessageI),
}

export interface UserChatRoomI {
	userId?				: number;
	roomId				: number;
	user				: UserI;
	room				: ChatRoomI;
	isOwner?			: boolean;
	isAdmin?			: boolean;
}

export const DefUserChatRoomI: UserChatRoomI = {
	roomId				: -1,
	user				: DefUserI,
	room				: DefChatRoomI,
}

export interface FriendI {
	user_info			: UserI;
	room				: ChatRoomI;
}

export const DefFriendI: FriendI = {
	user_info			: DefUserI,
	room				: DefChatRoomI,
}

export interface ChatI {
	user				: UserI;
	friends				: any;
	selected_friend_id	: string;
	selected_friend		: FriendI;
}

export const DefChatI: ChatI = {
	user				: DefUserI,
	friends				: {},
	selected_friend_id	: "-1",
	selected_friend		: DefFriendI,
}
