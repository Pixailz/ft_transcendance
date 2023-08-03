import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { DbModule } from "../database/database.module";
import { userService } from "./user.service";

@Module({
	imports: [DbModule],
	providers: [userService],
	controllers: [userController],
	exports: [userService],
})
export class UserModule {}
