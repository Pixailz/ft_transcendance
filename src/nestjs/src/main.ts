import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import configureSwagger from "./addons/swagger";
import { json } from "express";

import { AchievementService } from "./modules/database/achievements/service";
import { achievementsList } from "./modules/database/achievements/entity";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Enable cors
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			// Strip not specified field in post
			whitelist: true,
			// automatic strip for js object
			transform: true,
		}),
	);
	app.use(json({ limit: "50mb" }));

	configureSwagger(app);
	populateAchievements(app);

	await app.listen(3000);
}
bootstrap();

async function populateAchievements(app) {
	if (
		(await app.get(AchievementService).findAll().length) ===
		achievementsList.length
	)
		return;
	for (const achievement of achievementsList) {
		if (await app.get(AchievementService).findOne(achievement.name))
			continue;
		await app.get(AchievementService).create(achievement);
	}
}
