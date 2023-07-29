import {
	Entity,
	ManyToOne,
	Column,
	JoinColumn,
	PrimaryColumn,
	PrimaryGeneratedColumn
} from "typeorm";

import { UserEntity } from "../user/entity";

@Entity()
export class GameInfoEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@PrimaryColumn()
	public userA: number;

	@PrimaryColumn()
	public userB: number;

	@ManyToOne(type => UserEntity, user => user.gameUserA)
	@JoinColumn({ name: "userA" })
	firstUser: UserEntity;

	@ManyToOne(type => UserEntity, user => user.gameUserB)
	@JoinColumn({ name: "userB" })
	secondUser: UserEntity;

	@Column({ type: "varchar", length: 120, default: false })
	public type: string;

	@Column({ type: "integer", default: 0})
	public scoreA: number;

	@Column({ type: "integer", default: 0})
	public scoreB: number;
}