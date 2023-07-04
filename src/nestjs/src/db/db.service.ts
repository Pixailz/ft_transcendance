import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './db.dto';
import { User } from './db.entity';

@Injectable()
export class DbService {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
	){ }

	public getUser(id: number): Promise<User> {
		return this.repository.findOneById(id);
	}

	public createUser(body: CreateUserDto): Promise<User> {
		const user: User = new User();

		user.name = body.name;
		user.email = body.email;

		return this.repository.save(user);
	}
}
