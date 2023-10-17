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

	ACHIEVEMENT
}

export enum NotifStatus {
	NOTSEEN,
	SEEN,
	DELETED,
}


export interface NotificationI {
	id				: number,
	data			: any,
	data2			: any,
	toDisplay		: any,
	type			: NotificationType,
	status			: NotifStatus,
	createdAt?		: Date,
}

export const DefNotificationI =  {
	id				: -1,
	data			: {},
	data2			: {},
	toDisplay		: {},
	type			: NotificationType.UNDEFINED,
	status			: NotifStatus.NOTSEEN,
}
