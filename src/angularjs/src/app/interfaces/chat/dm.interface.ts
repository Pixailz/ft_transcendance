import { DefUserI } from "../user/user.interface";
import { DefChatRoomI } from "./chat-room.interface";

export interface ChatDmI {
	dm				: any;
	selected_dm_id	: string;
	selected_dm		: any;
}

export const DefChatDmI: ChatDmI = {
	dm				: {},
	selected_dm_id	: "-1",
	selected_dm		: {
		room: DefChatRoomI,
		user_info: DefUserI
	},
}
