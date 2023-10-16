export enum Status {
	DISCONNECTED,
	CONNECTED,
	AWAY,
}

export interface UserI {
	id					: number;
	ftLogin?			: string;
	nickname			: string;
	picture?			: string;
	email?				: string;
	nonce				: string;
	status?				: number;
	twoAuthFactor?		: boolean;
	lastSeen			: Date;
	elo?				: number;
}

export const DefUserI: UserI = {
	id					: -1,
	nickname			: "",
	lastSeen			: new Date(Date.now()),
	nonce				: "",
}
