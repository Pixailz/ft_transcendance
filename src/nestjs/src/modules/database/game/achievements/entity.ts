import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameAchievement {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 120 })
	name: string;

	@Column({ type: "text", length: 500 })
	description: string;

	@Column({ type: "int", default: 0 })
	points: number;

	@Column({ type: "varchar", length: 120 })
	imageUrl: string;

	@Column({ type: "int" })
	gameId: number;
}
