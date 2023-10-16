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

	@Column({ type: "int", default: 0 })
	public totalGames = 0;

	@Column({ type: "int", default: 0 })
	public totalWins = 0;

	@Column({ type: "int", default: 0 })
	public totalLoses = 0;

	@Column({ type: "int", default: 0 })
	public totalFriends = 0;

	@Column({ type: "int", default: 0 })
	public totalMessages = 0;

	@Column({ type: "int", default: 0 })
	public elo = 0;

	constructor(user: UserEntity) {
		this.user = user;
		this.totalFriends = 0;
		this.totalGames = 0;
		this.totalLoses = 0;
		this.totalMessages = 0;
		this.totalWins = 0;
		this.elo = 0;
	}
}
