import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { AchievementService } from "../achievements/service";
import { UserEntity } from "../user/entity";
import { UserMetricsEntity } from "./entity";

@Injectable()
export class UserMetricsService {
	constructor(
		@Inject(forwardRef(() => AchievementService))
		private achivementService: AchievementService,
		@InjectRepository(UserMetricsEntity)
		private readonly metricsRepository: Repository<UserMetricsEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async findAll(): Promise<UserMetricsEntity[]> {
		return await this.metricsRepository.find();
	}

	async findOneById(id: number): Promise<UserMetricsEntity> {
		return await this.metricsRepository.findOne({ where: { id } });
	}

	async create(
		metrics: Partial<UserMetricsEntity>,
	): Promise<UserMetricsEntity> {
		return await this.metricsRepository.save(metrics);
	}

	async update(
		id: number,
		metrics: Partial<UserMetricsEntity>,
	): Promise<UserMetricsEntity> {
		await this.metricsRepository.update(id, metrics);
		return this.metricsRepository.findOne({
			where: { id },
		});
	}

	async remove(id: number): Promise<void> {
		await this.metricsRepository.delete(id);
	}

	async updateMetrics(user: UserEntity) {
		const completeUser = await this.userRepository.findOne({
			where: { id: user.id },
			relations: [
				"gameInfos",
				"friend",
				"message",
				"metrics",
				"achievements",
				"achievements.achievement",
			],
		});
		if (!completeUser) return;
		const metrics = completeUser.metrics;
		metrics.totalGames = completeUser.gameInfos.length;
		metrics.totalWins = completeUser.gameInfos.filter(
			(gameInfo) => gameInfo.winnerId === completeUser.id,
		).length;
		metrics.totalLoses = metrics.totalGames - metrics.totalWins;
		metrics.totalFriends = completeUser.friend.length;
		metrics.totalMessages = completeUser.message.length;
		metrics.elo = completeUser.elo;

		await this.metricsRepository.save(metrics);
		await this.achivementService.checkAchievements(completeUser);
	}
}
