import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity";
import { MessageEntity } from "../message/entity";

@Entity()
export class ChatRoomEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public name: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public type: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public password!: string;

	@OneToMany((type) => UserChatRoomEntity, (roomInfo) => roomInfo.room)
	roomInfo: UserChatRoomEntity[];

	@OneToMany((type) => MessageEntity, (message) => message.room)
	message: MessageEntity[];
}
