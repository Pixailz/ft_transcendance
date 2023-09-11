import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { json } from "express";
import * as express from "express";
import * as http from "http";
import configureSwagger from "./addons/swagger";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ColyseusService } from "./addons/colyseus";
import { LobbyRoom } from "colyseus";

async function bootstrap() {
	const app = express();
	const nestApp = await NestFactory.create(AppModule, new ExpressAdapter());
	// Enable cors
	nestApp.enableShutdownHooks();
	nestApp.enableCors();
	nestApp.useGlobalPipes(
		new ValidationPipe({
			// Strip not specified field in post
			whitelist: true,
			// automatic strip for js object
			transform: true,
		}),
	);
	nestApp.use(json({ limit: "50mb" }));
	configureSwagger(nestApp);

	const httpServer = http.createServer(app);

	const colyseusService = nestApp.get(ColyseusService);
	colyseusService.createServer(httpServer);
	// colyseusService.rooms.forEach((room) => {
	// 	colyseusService.defineRoom(room.name, room);
	// 	console.log(`Defined room ${room.name}`);
	// });
	colyseusService.defineRoom("lobby", LobbyRoom);

	colyseusService.listen(3002).then(() => {
		console.log(`Listening on port 3002`);
	});

	await nestApp.listen(3000);
}

bootstrap();
