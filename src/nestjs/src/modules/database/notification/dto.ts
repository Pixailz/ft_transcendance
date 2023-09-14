import { IsNotIn, IsOptional } from "class-validator";
import { NotifStatus, NotificationType } from "./entity";

export class DBNotificationPost {
	@IsOptional()
	userId?: number;
	@IsOptional()
	type?: NotificationType;
	@IsOptional()
	status?: NotifStatus;
	@IsOptional()
	data?: string;
}
