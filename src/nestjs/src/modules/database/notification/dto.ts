import { IsNotIn, IsOptional } from "class-validator";
import { NotificationType } from "./entity";

export class DBNotificationPost {
	userId: number;
	@IsOptional()
	type?: NotificationType;
	@IsOptional()
	isSeen?: boolean;
	@IsOptional()
	isDeleted?: boolean;
	data: string;
}
