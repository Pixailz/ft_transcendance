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
export class MutedEntity {
	@PrimaryColumn()
	public meId: number;

	@PrimaryColumn()
	public mutedId: number;

	@ManyToOne((type) => UserEntity, (me) => me.meMuted, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "meId" })
	me: UserEntity;

	@ManyToOne((type) => UserEntity, (muted) => muted.muted, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "mutedId" })
	muted: UserEntity;
}
