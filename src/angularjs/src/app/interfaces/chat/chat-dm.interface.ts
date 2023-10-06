import { DefUserI } from "../user.interface";
import { DefChatRoomI } from "./chat-room.interface";
<<<<<<<< HEAD:src/angularjs/src/app/interfaces/chats/chat-dm.interface.ts
import { DefUserI } from "../user/user.interface";
========
>>>>>>>> origin/153-ws-matchmaking:src/angularjs/src/app/interfaces/chat/dm.interface.ts

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
