import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from "typeorm";

import { UserEntity } from "../user/entity";

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

	@Column({type: "integer", nullable: true})
	public userId: number;

	@ManyToOne((type) => UserEntity, (user) => user.notification, {
		onDelete: "SET NULL",
		nullable: true,
	})
	@JoinColumn({ name: "userId" })
	public user: UserEntity;

	@Column({ type: "integer", default: NotificationType.NOTSET })
	public type: NotificationType;
	
	@Column({ type: "boolean", default: false })
	public isSeen: boolean;

	@Column({ type: "boolean", default: false })
	public isDeleted: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;
}
