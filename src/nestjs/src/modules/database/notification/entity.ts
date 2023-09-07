import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

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

@Entity()
export class NotificationEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "integer", default: NotificationType.NOTSET })
	public type: number;
	
	@Column({ type: "boolean", default: false })
	public isSeen: boolean;

	@Column({ type: "boolean", default: false })
	public isDeleted: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;
}
