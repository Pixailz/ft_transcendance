import { UserI, DefUserI } from "./user.interface";

export interface FriendRequestI {
	meId				: number;
	friendId			: number;
	friend				: UserI;
	me					: UserI;
}

export const DefFriendRequestI : FriendRequestI = {
	meId				: -1,
	friendId			: -1,
	friend				: DefUserI,
	me					: DefUserI
}

export interface FriendListI {
	friends				: any,
	friend_req			: FriendRequestI[],
}

export const DefFriendListI : FriendListI = {
	friends				: {},
	friend_req			: Array(DefFriendRequestI),
}
