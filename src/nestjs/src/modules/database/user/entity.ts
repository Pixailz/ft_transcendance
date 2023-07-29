import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
} from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity"
import { GameInfoEntity } from "../gameInfo/entity";

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
	
	@Column({ type: "varchar", length: 120, default: "" })
	public status: string;

	@Column({ type: "boolean", default: false })
	public twoAuthFactor: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;
	
	@OneToMany(type => UserChatRoomEntity, roomInfo => roomInfo.user)
	roomInfo: UserChatRoomEntity[];

	@OneToMany(type => GameInfoEntity, gameInfo => gameInfo.firstUser)
	gameUserA: GameInfoEntity[];
	
	@OneToMany(type => GameInfoEntity, gameInfo => gameInfo.secondUser)
	gameUserB: GameInfoEntity[];
}
