import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './db.dto';
import { User } from './db.entity';
import { DbService } from './db.service';

@Controller('user')
export class DbController {
	@Inject(DbService)
	private readonly service: DbService;

	@Get(':id')
	public getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.service.getUser(id);
	}

	@Post()
	public createUser(@Body() body: CreateUserDto): Promise<User> {
		return this.service.createUser(body);
	}
}
