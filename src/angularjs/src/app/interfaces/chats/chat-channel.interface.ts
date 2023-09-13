import { ChatRoomI, DefChatRoomI, } from "./chat-room.interface";

export enum RoomAction {
	KICK,
	PROMOTE,
	OWNERSHIP,
}

export interface ChatChannelI {
	available_room		: any,
	joined_room			: any,
	selected_room_id	: string;
	selected_room		: ChatRoomI;
}

export const DefChatChannelI: ChatChannelI = {
	available_room		: {},
	joined_room			: {},
	selected_room_id	: "-1",
	selected_room		: DefChatRoomI,
}
