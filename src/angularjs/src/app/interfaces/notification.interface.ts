export enum NotificationType {
	NOTSET,
	FRIENDREQUEST,
	FRIENDACCEPT,
	FRIENDREJECT,
	GAMEREQUEST,
	GAMEDACCEPT,
	GAMEREJECT,
	DMREQUEST,
	DMACCEPT,
	DMREJECT,
}

export interface NotificationI {
	type			: NotificationType,
	data			: any,
}

export const DefNotificationI =  {
	type : -1,
	data : null,
}