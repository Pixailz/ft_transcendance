import { DefUserI, UserI } from "./user.interface";

export interface UserChatRoomI {
	userId?				: number;
	roomId				: number;
	user				: UserI;
	isOwner?			: boolean;
	isAdmin?			: boolean;
}

export const DefUserChatRoomI: UserChatRoomI = {
	roomId				: -1,
	user				: DefUserI,
}
