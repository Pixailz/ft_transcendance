import { ChatRoomI, UserI, DefUserI, DefChatRoomI, } from "../../interfaces/chat.interface";

export enum RoomAction {
	KICK,
}

export interface ChatGlobI {
	user				: UserI;
	available_room		: any,
	joined_room			: any,
	selected_room_id	: string;
	selected_room		: ChatRoomI;
}

export const DefChatGlobI: ChatGlobI = {
	user				: DefUserI,
	available_room		: {},
	joined_room			: {},
	selected_room_id	: "-1",
	selected_room		: DefChatRoomI,
}
