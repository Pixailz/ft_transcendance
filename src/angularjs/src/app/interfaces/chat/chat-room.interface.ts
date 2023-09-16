import { DefMessageI, MessageI } from "./message.inteface";
import { DefUserChatRoomI, UserChatRoomI } from "./user-chat-room.interface";

export enum RoomType {
	PRIVATE,
	PUBLIC,
	PROTECTED,
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
