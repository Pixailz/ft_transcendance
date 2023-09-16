import { UserI, DefUserI } from "../user/user.interface";
import { DefUserChatRoomI, UserChatRoomI } from "../user/user-chat-room.interface";

export enum RoomType {
	PRIVATE,
	PUBLIC,
	PROTECTED,
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
	roomInfo			: UserChatRoomI[];
	message				: MessageI[];
}

export const DefChatRoomI: ChatRoomI = {
	id					: -1,
	type				: -1,
	message				: Array(DefMessageI),
	roomInfo			: Array(DefUserChatRoomI),
}
