import { Injectable } from "@nestjs/common";
import { WSSocket } from "../socket.service";
import { DBNotificationService } from "src/modules/database/notification/service";
import { Socket } from "socket.io";
import { NotificationEntity } from "src/modules/database/notification/entity";
import { DBUserService } from "src/modules/database/user/service";

enum NotificationType {
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

interface NotificationI {
	type			: NotificationType,
	data			: any,
}

export const DefNotificationI =  {
	type : -1,
	data : null,
}

@Injectable()
export class WSNotificationService {
	constructor(
		public wsSocket: WSSocket,
		private dbNotificationService: DBNotificationService,
		private dBUserService: DBUserService
	) {}

	async getAllNotifications(socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const notifs_e: NotificationEntity[] = await this.dbNotificationService.getNotifByUserId(user_id)
		let notifs_i: NotificationI[] = [];
		for (let notif of notifs_e) {
			let notif_i: NotificationI = DefNotificationI;
			let data = {};
			notif_i.type = notif.type;
			switch (notif.type) {
				case (NotificationType.FRIENDREQUEST):
					const user = await this.dBUserService.returnOne(notif.sourceId);
					data = {ft_login: user.ftLogin, id: user.id};
					break ;
				case (NotificationType.NOTSET):
					data = {message: notif.data};
						break ;
				default:
					break ;
			}
			notifs_i.push(notif_i);
		}
		socket.emit("getAllNotifications", notifs_i);
	}
}