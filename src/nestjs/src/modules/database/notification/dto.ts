import { IsNotEmpty, IsNumber } from "class-validator";
import { NotificationType } from "./entity";

export class DBNotificationPost {
	type: NotificationType;
	isSeen: boolean;
	isDeleted: boolean;
}
