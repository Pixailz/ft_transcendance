export enum NotificationType {
	UNDEFINED,
	// FRIEND
	FRIEND_REQ_SENT,
	FRIEND_REQ_RECEIVED,
	FRIEND_REQ_ACCEPTED,
	FRIEND_REQ_DENIED_FROM,
	FRIEND_REQ_DENIED_TO,

	// TODO: GAME INVITE
	GAME_REQ,
	GAME_REQ_DACCEPT,
	GAME_REQ_DENIED,

	// TODO: PRIVATE CHANNEL INVITE
	CHANNEL_REQUEST,
	CHANNEL_REQ_ACCEPT,
	CHANNEL_REQ_DENIED,
}

export interface NotificationI {
	id				: number,
	data			: any,
	type			: NotificationType,
	isSeen			: boolean,
	createdAt?		: Date,
}

export const DefNotificationI =  {
	id				: -1,
	data			: {},
	type			: NotificationType.UNDEFINED,
	isSeen			: false,
}
