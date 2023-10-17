import { Module } from "@nestjs/common";
import { GameController } from "./controller";
import { DBModule } from "../../modules/database/database.module";

@Module({
	imports: [DBModule],
	controllers: [GameController],
})
export class GameAdapterModule {}
