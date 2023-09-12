import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { NotificationType } from "./entity";

export class DBNotificationPost {
	@IsOptional()
	type?: NotificationType;
	@IsOptional()
	isSeen?: boolean;
	@IsOptional()
	isDeleted?: boolean;
	@IsOptional()
	sourceId?: number;
	@IsOptional()
	data?: string;
}
