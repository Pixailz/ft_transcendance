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
import { FriendEntity } from "../friend/entity";
import { BlockedEntity } from "../blocked/entity"
import { Exclude } from "class-transformer";
import { NotificationEntity } from "../notification/entity";

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

	@OneToMany((type) => GameInfoEntity, (gameInfo) => gameInfo.firstUser)
	gameUserA: GameInfoEntity[];

	@OneToMany((type) => GameInfoEntity, (gameInfo) => gameInfo.secondUser)
	gameUserB: GameInfoEntity[];

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

	// muted
	@OneToMany((type) => BlockedEntity, (blocked) => blocked.me)
	meBlocked: BlockedEntity[];

	@OneToMany((type) => BlockedEntity, (blocked) => blocked.blocked)
	blocked: BlockedEntity[];

	@OneToMany((type) => NotificationEntity, (notif) => notif.user)
	notification: NotificationEntity[];

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
