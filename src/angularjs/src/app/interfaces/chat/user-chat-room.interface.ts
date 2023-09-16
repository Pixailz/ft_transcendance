import { DefUserI, UserI } from "../user.interface";

export interface UserChatRoomI {
	userId?				: number;
	roomId				: number;
	user				: UserI;
	isOwner?			: boolean;
	isAdmin?			: boolean;
	isBanned			: boolean;
	isMuted				: boolean;
	demuteDate			: Date;
}

export const DefUserChatRoomI: UserChatRoomI = {
	roomId				: -1,
	user				: DefUserI,
	isBanned			: false,
	isMuted				: false,
	demuteDate			: new Date(),
}
