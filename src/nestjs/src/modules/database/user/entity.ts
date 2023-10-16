import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from "typeorm";

import { UserChatRoomEntity } from "../userChatRoom/entity";
import { GameInfoEntity } from "../game/gameInfo/entity";
import { MessageEntity } from "../message/entity";
import { FriendEntity } from "../friend/entity";
import { BlockedEntity } from "../blocked/entity";
import { Exclude } from "class-transformer";
import { PlayerScoreEntity } from "../game/playerScore/entity";

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
	public password: string;

	@Column({ type: "text", default: "" })
	public picture: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public email: string;

	@Column({ type: "integer", default: Status.DISCONNECTED })
	public status: number;

	@Column({ type: "integer", default: 800 })
	public elo: number;

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
	public playerScores: PlayerScoreEntity[];

	@ManyToMany((type) => GameInfoEntity, (gameInfo) => gameInfo.usersArray)
	@JoinTable({
		name: "game_users",
		joinColumn: { name: "game_info_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
	})
	public gameInfos: GameInfoEntity[];

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
