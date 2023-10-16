import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
	AchievementEntity,
	UserAchievementEntity,
	achievementsConditions,
} from "./entity";
import { UserEntity } from "../user/entity";
import { WSNotificationService } from "../../../websocket/notifications/notifications.service";
import { WSGateway } from "../../../websocket/gateway";
@Injectable()
export class AchievementService {
	constructor(
		@InjectRepository(AchievementEntity)
		private readonly achievementRepository: Repository<AchievementEntity>,
		@InjectRepository(UserAchievementEntity)
		private readonly userAchievementRepository: Repository<UserAchievementEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private wsNotificationService: WSNotificationService,
		private wsGateway: WSGateway,
	) {}

	async findAll(): Promise<AchievementEntity[]> {
		return await this.achievementRepository.find();
	}

	async findOneById(id: number): Promise<AchievementEntity> {
		return await this.achievementRepository.findOne({ where: { id } });
	}

	async findOne(name: string): Promise<AchievementEntity> {
		return await this.achievementRepository.findOne({ where: { name } });
	}

	async create(
		achievement: Partial<AchievementEntity>,
	): Promise<AchievementEntity> {
		return await this.achievementRepository.save(achievement);
	}

	async update(
		id: number,
		achievement: Partial<AchievementEntity>,
	): Promise<AchievementEntity> {
		await this.achievementRepository.update(id, achievement);
		return this.achievementRepository.findOne({
			where: { id },
		});
	}

	async remove(id: number): Promise<void> {
		await this.achievementRepository.delete(id);
	}

	async checkAchievements(user: UserEntity) {
		const achievementsList = await this.findAll();
		const newAchievements = [];

		for (let i = 0; i < achievementsList.length; i++) {
			const achievement = achievementsList[i];
			const hasAchievement = user.achievements.some(
				(userAchievement) =>
					userAchievement?.achievement?.id === achievement?.id,
			);
			const condition = achievementsConditions.find(
				(elem) => elem.name === achievement.name,
			).condition;

			if (!hasAchievement && condition(user.metrics)) {
				newAchievements.push(achievement.id);
			}
		}

		if (newAchievements.length > 0) {
			for (let i = 0; i < newAchievements.length; i++) {
				const newAchievement = new UserAchievementEntity({
					user: user,
					achievement: await this.findOneById(newAchievements[i]),
				});
				await this.userAchievementRepository.save(newAchievement);
				user.achievements.push(newAchievement);
				await this.userRepository.save(user);
				this.wsNotificationService.sendAchievement(
					this.wsGateway.server,
					user.id,
					newAchievement.achievement.name,
					newAchievement.achievement.description,
				);
				console.log(
					"unlocked achievement",
					newAchievement.achievement.name,
					"for user",
					user.nickname,
					"(",
					user.id,
					")",
				);
			}
		}
	}
}
