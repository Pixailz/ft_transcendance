import { DefUserI, UserI } from "../user/user.interface";
import { ChatRoomI } from "./chat-room.interface";

export enum MessageContentType {
	STRING,
	GAME_INVITE,
	// TODO
	IMAGE,
}

export interface MessageI {
	id					: number;
	roomId?				: number;
	userId				: number;
	user				: UserI;
	room?				: ChatRoomI;
	content				: MessageContentI[];
	updateAt?			: Date;
}

export const DefMessageI: MessageI = {
	id					: -1,
	userId				: -1,
	user				: DefUserI,
	content				: []
}

export interface MessageContentI {
	type				: MessageContentType;
	content				: string
}

export const DefMessageContentI: MessageContentI = {
	type				: MessageContentType.STRING,
	content				: "",
}
