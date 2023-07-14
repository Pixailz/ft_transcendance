import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Enable cors
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({
		// Strip not specified field in post
		whitelist: true,
		// automatic strip for js object
		transform: true,
	}));
	await app.listen(3000);
}
bootstrap();
