export enum Status {
	DISCONNECTED,
	CONNECTED,
	AWAY,
}

export enum RoomType {
	PRIVATE,
	PUBLIC,
	PROTECTED,
}

export interface UserI {
	id					: number;
	ftLogin?			: string;
	nickname			: string;
	picture?			: string;
	email?				: string;
	nonce				: string;
	status?				: number;
	twoAuthFactor?		: boolean;
	lastSeen			: Date;
}

export const DefUserI: UserI = {
	id					: -1,
	nickname			: "",
	lastSeen			: new Date(Date.now()),
	nonce				: "",
}

export interface MessageI {
	id					: number;
	roomId?				: number;
	userId				: number;
	user				: UserI;
	room?				: ChatRoomI;
	content?			: string;
	updateAt?			: Date;
}

export const DefMessageI: MessageI = {
	id					: -1,
	userId				: -1,
	user				: DefUserI,
}

export interface ChatRoomI {
	id					: number;
	name?				: string;
	type				: number;
	password?			: string;
	user				: UserI;
	roomInfo?			: UserChatRoomI[];
	message				: MessageI[];
}

export const DefChatRoomI: ChatRoomI = {
	id					: -1,
	user				: DefUserI,
	type				: -1,
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

export interface FriendRequestI {
	meId : number;
	friendId : number;
}

export const DefFriendRequestI : FriendRequestI = {
	meId : -1,
	friendId : -1,
}
