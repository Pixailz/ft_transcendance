import { Module } from "@nestjs/common";
import { UserController } from "./controller";
import { DBModule } from "../../modules/database/database.module";

@Module({
	imports: [DBModule],
	controllers: [UserController],
})
export class UserModule {}
