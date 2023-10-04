import {
	Entity,
	ManyToOne,
	Column,
	JoinColumn,
	PrimaryGeneratedColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
} from "typeorm";

import { UserEntity } from "../../user/entity";
import { PlayerScoreEntity } from "../player-score/entity";

@Entity()
export class GameInfoEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "simple-array", nullable: true })
	public users: number[];

	@ManyToMany((type) => UserEntity, {
		onDelete: "SET NULL",
		nullable: true,
	})
	@JoinTable({
		name: "game_users",
		joinColumn: { name: "game_info_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
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
	public playerScores: PlayerScoreEntity[];
}