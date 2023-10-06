import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
} from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity";
import { GameInfoEntity } from "../game/gameInfo/entity";
import { MessageEntity } from "../message/entity";
import { FriendEntity } from "../friend/entity";
import { BlockedEntity } from "../blocked/entity";
import { Exclude } from "class-transformer";
import { PlayerScoreEntity } from "../game/player-score/entity";

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

	@Column({ type: "text", default: "" })
	public picture: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public email: string;

	@Column({ type: "integer", default: Status.DISCONNECTED })
	public status: number;

	@Column({ type: "boolean", default: false })
	public twoAuthFactor: boolean;

	@Exclude()
	@Column({ type: "varchar", default: "" })
	public twoAuthFactorSecret: string;

	@Exclude()
	@Column({ type: "varchar", length: 64, default: "" })
	public nonce: string;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;

	@CreateDateColumn({ type: "timestamp" })
	public lastSeen!: Date;

	@OneToMany((type) => UserChatRoomEntity, (roomInfo) => roomInfo.user)
	roomInfo: UserChatRoomEntity[];

	@OneToMany(
		(type) => PlayerScoreEntity,
		(playerScore) => playerScore.playerId,
	)
	playerScores: PlayerScoreEntity[];

	@ManyToMany((type) => GameInfoEntity, (gameInfo) => gameInfo.usersArray)
	gameInfos: GameInfoEntity[];

	@OneToMany((type) => MessageEntity, (message) => message.user)
	message: MessageEntity[];

	//friend
	@OneToMany((type) => FriendEntity, (friendMe) => friendMe.me)
	me: FriendEntity[];

	@OneToMany((type) => FriendEntity, (friend) => friend.friend)
	friend: FriendEntity[];

	//friend req
	@OneToMany((type) => FriendEntity, (friendMe) => friendMe.me)
	meFriendReq: FriendEntity[];

	@OneToMany((type) => FriendEntity, (friend) => friend.friend)
	friendReq: FriendEntity[];

	// blocked
	@OneToMany((type) => BlockedEntity, (blocked) => blocked.me)
	meBlocked: BlockedEntity[];

	@OneToMany((type) => BlockedEntity, (blocked) => blocked.target)
	target: BlockedEntity[];

	// muted

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
