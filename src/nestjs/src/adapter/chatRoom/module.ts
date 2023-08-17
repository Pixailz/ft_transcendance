import { Module } from "@nestjs/common";
import { DBModule } from "../../modules/database/database.module";

@Module({
	imports: [DBModule],
})
export class ChatRoomModule {}
