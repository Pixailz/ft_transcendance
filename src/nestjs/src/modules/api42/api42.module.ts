import { Module } from "@nestjs/common";
import { Api42Service } from "./api42.service";

@Module({
	providers: [Api42Service],
	controllers: [],
	exports: [Api42Service],
})
export class Api42Module {}
