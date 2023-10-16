import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
} from "typeorm";

import { UserEntity } from "../../user/entity";
import { PlayerScoreEntity } from "../playerScore/entity";

@Entity()
export class GameInfoEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "simple-array", nullable: true })
	public users: number[];

	@ManyToMany((type) => UserEntity, (user) => user.gameInfos, {
		onDelete: "SET NULL",
		nullable: true,
	})
	usersArray: UserEntity[];

	@Column({ type: "varchar", length: 120, default: false })
	public type: string;

	@OneToMany(
		(type) => PlayerScoreEntity,
		(playerScore) => playerScore.gameInfo,
		{
			cascade: true,
		},
	)
	public playersScores: PlayerScoreEntity[];

	@Column({ type: "integer", default: -1 })
	public winnerId: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	public createdAt: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	public finishedAt: Date;
}
