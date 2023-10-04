import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from "typeorm";

import { GameInfoEntity } from "../gameInfo/entity";

@Entity()
export class PlayerScoreEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "int" })
	public playerId: number;

	@Column({ type: "int" })
	public score: number;

	@ManyToOne((type) => GameInfoEntity, (gameInfo) => gameInfo.playerScores)
	public gameInfo: GameInfoEntity;
}
