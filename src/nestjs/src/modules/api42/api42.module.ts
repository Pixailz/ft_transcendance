import { Module } from "@nestjs/common";
import { Api42Service } from "./api42.service";
import { Api42Controller } from "./api42.controller";

@Module({
	providers: [Api42Service],
	controllers: [Api42Controller],
	exports: [Api42Service],
})
export class Api42Module {}
