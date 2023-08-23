import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
} from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity";
import { GameInfoEntity } from "../gameInfo/entity";
import { MessageEntity } from "../message/entity";

export enum Status {
	DISCONNECTED,
	CONNECTED,
	AWAY,
}

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public ftLogin: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public nickname: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public picture: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public email: string;

	@Column({ type: "integer", default: Status.DISCONNECTED })
	public status: number;

	@Column({ type: "boolean", default: false })
	public twoAuthFactor: boolean;

	@Column({ type: "varchar", length: 64, default: "" })
	public nonce: string;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;

	@CreateDateColumn({ type: "timestamp" })
	public lastSeen!: Date;

	@OneToMany((type) => UserChatRoomEntity, (roomInfo) => roomInfo.user)
	roomInfo: UserChatRoomEntity[];

	@OneToMany((type) => GameInfoEntity, (gameInfo) => gameInfo.firstUser)
	gameUserA: GameInfoEntity[];

	@OneToMany((type) => GameInfoEntity, (gameInfo) => gameInfo.secondUser)
	gameUserB: GameInfoEntity[];

	@OneToMany((type) => MessageEntity, (message) => message.user)
	message: MessageEntity[];
}
