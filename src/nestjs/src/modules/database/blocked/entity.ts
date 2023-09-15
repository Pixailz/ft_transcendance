import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";

import { UserEntity } from "../user/entity";

@Entity()
export class BlockedEntity {
	@PrimaryColumn()
	public meId: number;

	@PrimaryColumn()
	public targetId: number;

	@ManyToOne((type) => UserEntity, (me) => me.meBlocked, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "meId" })
	me: UserEntity;

	@ManyToOne((type) => UserEntity, (blocked) => blocked.target, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "targetId" })
	target: UserEntity;
}
