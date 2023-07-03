import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbController } from './db.controller';
import { User } from './db.entity';
import { DbService } from './db.service';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgresql',
			port: 5432,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			entities: [User],
			synchronize: true,
			autoLoadEntities: true,
		})
	],
	controllers: [DbController],
	providers: [DbService],
})
export class DbModule {}
