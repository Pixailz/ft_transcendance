export interface UserI {
	id					: number;
	ftLogin?			: string;
	nickname			: string;
	picture?			: string;
	email?				: string;
	status?				: string;
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
	userId?				: number;
	user				: UserI;
	room?				: ChatRoomI;
	content?			: string;
	updateAt?			: Date;
}

export const DefMessageI: MessageI = {
	id					: -1,
	user				: DefUserI
}

export interface ChatRoomI {
	id					: number;
	name?				: string;
	type?				: string;
	password?			: string;
	user?				: UserI;
	roomInfo?			: UserChatRoomI;
	message				: MessageI[];
}

export const DefChatRoomI: ChatRoomI = {
	id					: -1,
	message				: Array(DefMessageI),
}

export interface UserChatRoomI {
	userId?				: number;
	roomId				: number;
	user?				: UserI;
	room				: ChatRoomI;
	isOwner?			: boolean;
	isAdmin?			: boolean;
}

export const DefUserChatRoomI: UserChatRoomI = {
	roomId				: -1,
	room				: DefChatRoomI,
}
