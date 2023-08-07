import { Module } from "@nestjs/common";
import { UserController } from "./controller";
import { DBModule } from "../database/database.module";

@Module({
	imports: [DBModule],
	providers: [],
	controllers: [UserController],
})
export class UserModule {}
