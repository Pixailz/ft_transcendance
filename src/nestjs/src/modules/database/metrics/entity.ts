import {
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	Column,
} from "typeorm";
import { UserEntity } from "../user/entity";
@Entity()
export class UserMetricsEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(() => UserEntity, (user) => user.metrics)
	@JoinColumn({ name: "userId" })
	public user: UserEntity;

	@Column({ type: "int" })
	public totalGames = 0;

	@Column({ type: "int" })
	public totalWins = 0;

	@Column({ type: "int" })
	public totalLoses = 0;

	@Column({ type: "int" })
	public totalFriends = 0;

	@Column({ type: "int" })
	public totalMessages = 0;

	@Column({ type: "int" })
	public elo = 0;

	constructor(partial: Partial<UserMetricsEntity>) {
		Object.assign(this, partial);
	}
}
