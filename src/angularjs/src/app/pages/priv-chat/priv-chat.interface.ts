import { UserI, DefUserI, FriendI, DefFriendI } from "../../interfaces/chat.interface";


export interface ChatPrivI {
	user				: UserI;
	friends				: any;
	selected_friend_id	: string;
	selected_friend		: FriendI;
}

export const DefChatPrivI: ChatPrivI = {
	user				: DefUserI,
	friends				: {},
	selected_friend_id	: "-1",
	selected_friend		: DefFriendI,
}
