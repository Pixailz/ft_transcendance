import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { Api42Module } from '../api42/api42.module';
import { UserService } from '../database/user/service';
import { DbModule } from '../database/database.module';

@Module({
  imports: [JwtModule.register({
				global: true,
				secret: process.env.JWT_SECRET,
				signOptions: { expiresIn: '1d' },
			}),
			Api42Module,
			DbModule
			],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
