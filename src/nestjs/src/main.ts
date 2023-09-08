import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import configureSwagger from "./swagger";
import { json } from "express";
import { DBUserService } from "./modules/database/user/service";

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
	createRootUser(app);

	await app.listen(3000);
}
bootstrap();

async function createRootUser(app) {
	if (process.env.ROOT_USER_ID !== undefined) return;

	const userService = await app.get(DBUserService);

	const search = await userService.returnOne(null, "root");
	if (search?.id >= 0) {
		process.env.ROOT_USER_ID = search.id;
		console.log("Root user found with id " + search.id);
		return;
	}

	const rootInfo = {
		email: "",
		nickname: "root",
		ftLogin: "root",
	};

	const rootId = await userService.create(rootInfo);

	if (rootId < 0) {
		console.debug(rootId);
		throw new Error("Root user creation failed");
	}
	process.env.ROOT_USER_ID = rootId;
	console.log("Root user created with id " + rootId);
}
