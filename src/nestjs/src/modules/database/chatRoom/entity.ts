import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity";
import { MessageEntity } from "../message/entity";

export enum RoomType {
	PRIVATE,
	PUBLIC,
	PROTECTED,
}

@Entity()
export class ChatRoomEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public name: string;

	@Column({ type: "integer", default: RoomType.PUBLIC })
	public type: number;

	@Column({ type: "varchar", default: "" })
	public password!: string;

	@OneToMany((type) => UserChatRoomEntity, (roomInfo) => roomInfo.room)
	roomInfo: UserChatRoomEntity[];

	@OneToMany((type) => MessageEntity, (message) => message.room)
	message: MessageEntity[];
}
