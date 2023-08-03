import { Module } from "@nestjs/common";
import { dbUserService } from "./service";

@Module({
	providers: [dbUserService],
	controllers: [],
	exports: [dbUserService],
})
export class dbUserModule {}
