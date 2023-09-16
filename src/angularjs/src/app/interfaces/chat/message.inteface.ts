import { DefUserI, UserI } from "../user/user.interface";
import { ChatRoomI } from "./chat-room.interface";

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