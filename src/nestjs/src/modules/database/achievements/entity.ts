import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { UserEntity } from "../user/entity";
import { Exclude } from "class-transformer";
import { UserMetricsEntity } from "../metrics/entity";

@Entity()
export class AchievementEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 120 })
	name: string;

	@Column({ type: "text" })
	description: string;

	@Column({ type: "int", default: 0 })
	points: number;

	@Column({ type: "varchar", length: 120 })
	imageUrl: string;
}

@Entity()
export class UserAchievementEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.achievements)
	@JoinColumn({ name: "userEntity" })
	user: UserEntity;

	@ManyToOne(() => AchievementEntity)
	@JoinColumn({ name: "achievementEntity" })
	achievement: AchievementEntity;

	constructor(partial: Partial<UserAchievementEntity>) {
		Object.assign(this, partial);
	}
}

export const achievementsList: Partial<AchievementEntity>[] = [
	{
		name: "First game",
		description: "Play your first game",
		points: 10,
		imageUrl: "/assets/achivements/fst_game.svg",
	},
	{
		name: "AFK",
		description: "Lose your first game",
		points: 10,
		imageUrl: "/assets/achivements/afk.svg",
	},
	{
		name: "I'm a pro",
		description: "Win 10 games",
		points: 100,
		imageUrl: "/assets/achivements/win10.svg",
	},
	{
		name: "Oh It's Ranked?",
		description: "Lose 50% of your initial elo",
		points: 420,
		imageUrl: "/assets/achivements/elolose.svg",
	},
	{
		name: "I've got friends?!",
		description: "Add a friend",
		points: 10,
		imageUrl: "/assets/achivements/friend.svg",
	},
	{
		name: "MasterTyper",
		description: "Send 100 messages",
		points: 100,
		imageUrl: "/assets/achivements/typer.svg",
	},
];

export const achievementsConditions: {
	name: string;
	condition: (metrics?: UserMetricsEntity) => boolean;
}[] = [
	{
		name: "First game",
		condition: (metrics?: UserMetricsEntity) => {
			return metrics?.totalGames > 0;
		},
	},
	{
		name: "AFK",
		condition: (metrics?: UserMetricsEntity) => {
			return metrics?.totalLoses > 0;
		},
	},
	{
		name: "I'm a pro",
		condition: (metrics?: UserMetricsEntity) => {
			return metrics?.totalWins >= 10;
		},
	},
	{
		name: "Oh It's Ranked?",
		condition: (metrics?: UserMetricsEntity) => {
			return metrics?.elo <= 400;
		},
	},
	{
		name: "I've got friends?!",
		condition: (metrics?: UserMetricsEntity) => {
			return metrics?.totalFriends >= 1;
		},
	},
	{
		name: "MasterTyper",
		condition: (metrics?: UserMetricsEntity) => {
			return metrics?.totalMessages >= 100;
		},
	},
];
