export interface UserI {
	id: number;
	ftLogin?: string;
	nickname?: string;
	picture?: string;
	email?: string;
	status?: string;
}

export interface ChatRoomI {
	id: number;
	name?: string;
	type?: string;
	password?: string;
}
