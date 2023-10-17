import { Module } from "@nestjs/common";
import * as bcrypt from "bcrypt";

export class BrcyptWrap
{
	async hash(password: string): Promise<string>
	{ return (await bcrypt.hash(password, await bcrypt.genSalt())); }

	async compare(password: string, hash: string): Promise<boolean>
	{ return (await bcrypt.compare(password, hash)); }
}
