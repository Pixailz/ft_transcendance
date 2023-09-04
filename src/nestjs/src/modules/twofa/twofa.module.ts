import { Module } from "@nestjs/common";
import { TwofaController } from "./twofa.controller";
import { TwofaService } from "./twofa.service";
import { DBModule } from "../database/database.module";

@Module({
	controllers: [TwofaController],
	providers: [TwofaService],
	imports: [DBModule],
})
export class TwofaModule {}
