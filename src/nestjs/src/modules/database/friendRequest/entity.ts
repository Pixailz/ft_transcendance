import {
	Entity,
	Column,
	OneToMany,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";

import { UserEntity } from "../user/entity";

@Entity()
export class FriendRequestEntity {
	@PrimaryColumn()
	public meId: number;

	@PrimaryColumn()
	public friendId: number;

	@ManyToOne((type) => UserEntity, (me) => me.meFriendReq, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "meId" })
	me: UserEntity;

	@ManyToOne((type) => UserEntity, (friend) => friend.friendReq, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "friendId" })
	friend: UserEntity;
}
