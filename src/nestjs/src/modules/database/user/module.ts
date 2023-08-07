import { Module } from "@nestjs/common";
import { DBUserService } from "./service";

@Module({
	providers: [DBUserService],
	controllers: [],
	exports: [DBUserService],
})
export class DBUserModule {}
