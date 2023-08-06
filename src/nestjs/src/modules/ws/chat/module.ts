import { Module } from "@nestjs/common";

import { WSChatGateway } from "./gateway";
import { AuthModule } from "src/modules/auth/module";
import { DBModule } from "src/modules/database/database.module";
import { UserModule } from "src/modules/user/module";

@Module({
	imports: [AuthModule, DBModule, UserModule],
	providers: [WSChatGateway],
})
export class WSChatModule {}
