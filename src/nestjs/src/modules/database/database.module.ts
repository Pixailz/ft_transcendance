import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./user.entity";
import { ConfigModule } from "@nestjs/config";

import { DbController } from "./database.controller"
import { DbService } from "./database.service"


@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "postgresql",
			port: 5432,
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
