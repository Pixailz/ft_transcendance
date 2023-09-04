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
export class FriendEntity {
	@PrimaryColumn()
	public meId: number;

	@PrimaryColumn()
	public friendId: number;

	@ManyToOne((type) => UserEntity, (me) => me.me, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "meId" })
	me: UserEntity;

	@ManyToOne((type) => UserEntity, (friend) => friend.friend, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "friendId" })
	friend: UserEntity;
}
