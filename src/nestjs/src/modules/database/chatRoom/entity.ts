import {
	Entity,
	Column,
	OneToMany,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity";

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

	@OneToMany(type => UserChatRoomEntity, roomInfo => roomInfo.room)
	roomInfo: UserChatRoomEntity[];

}