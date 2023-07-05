import { Body, Controller, Post, Req, Res, Get, Param} from "@nestjs/common";
import { Request, Response } from 'express'
import { DbService } from "./database.service";
import { Observable } from "rxjs";

export class UserPost {
	name: string;
	email: string;
	isDeleted: boolean;
	ft_login: string;
	ft_id: number;
}

export class UserId {
	uid?: number;
	ft_id?: number;
}

@Controller("db")
export class DbController {
	constructor (private readonly dbService: DbService) {};

	@Post()
	create(@Body() post: UserPost){
		console.log(post);
		return this.dbService.createUser(post);
	}

	@Get('get/:id')
	async get(@Param("id") userId: number, @Req() req: Request, @Res() res: Response){
		res.send(await this.dbService.returnUser(userId));
	}
}
