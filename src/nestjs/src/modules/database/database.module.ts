import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { UserEntity } from "./user/entity";
import { UserService } from "./user/service";
import { UserController } from "./user/controller";

import { UserInfoEntity } from "./userInfo/entity";
import { UserInfoService } from "./userInfo/service";
import { UserInfoController } from "./userInfo/controller";

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
			entities: [UserEntity, UserInfoEntity],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([UserEntity, UserInfoEntity]),
	],
	controllers: [UserController, UserInfoController],
	providers: [UserService, UserInfoService],
})
export class DbModule {}
