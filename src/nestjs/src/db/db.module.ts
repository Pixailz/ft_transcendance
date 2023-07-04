import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbController } from "src/db/db.controler"
import { DbService } from "src/db/db.service"
import { UserEntity } from "src/db/db.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "postgresql",
			port: 5432,
			// username: "pix",
			// password: "1234",
			// database: "nest_api",
			username: process.env.DB_USER.toString(),
			password: process.env.DB_PASS.toString(),
			database: process.env.DB_NAME.toString(),
			entities: [UserEntity],
			synchronize: true
		}),
		TypeOrmModule.forFeature([UserEntity])
	],
	controllers: [DbController],
	providers: [DbService]
})
export class DbModule {}
