import { Entity, ManyToOne, Column, JoinColumn, PrimaryColumn } from "typeorm";

import { UserEntity } from "../user/entity";
import { ChatRoomEntity } from "../chatRoom/entity";

@Entity()
export class UserChatRoomEntity {
	@PrimaryColumn()
	public userId: number;

	@PrimaryColumn()
	public roomId: number;

	@ManyToOne((type) => UserEntity, (user) => user.roomInfo, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "userId" })
	user: UserEntity;

	@ManyToOne((type) => ChatRoomEntity, (room) => room.roomInfo, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "roomId" })
	room: ChatRoomEntity;

	@Column({ type: "boolean", default: false })
	public isOwner: boolean;

	@Column({ type: "boolean", default: false })
	public isAdmin: boolean;
}
