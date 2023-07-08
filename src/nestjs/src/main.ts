import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		// Strip not specified field in post
		whitelist: true,
		// automatic strip for js object
		transform: true,
	}));
	await app.listen(3000);
}
bootstrap();
