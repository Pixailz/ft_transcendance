import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";

import { UserEntity } from "../user/entity";
import { ChatRoomEntity } from "../chatRoom/entity";

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "integer", nullable: true})
	public roomId: number;

	@Column({ type: "integer", nullable: true})
	public userId: number;

	@ManyToOne(type => UserEntity, user => user.message, { onDelete: 'SET NULL', nullable: true })
	@JoinColumn({ name: "userId" })
	public user: UserEntity;

	@ManyToOne(type => ChatRoomEntity, room => room.message, { onDelete: 'SET NULL', nullable: true })
	@JoinColumn({ name: "roomId" })
	public room: ChatRoomEntity;

	@Column({ type: "varchar", length: 120, default: "" })
	public content: string;
	
	@CreateDateColumn({ type: "timestamp" })
	public updateAt: Date;
}
