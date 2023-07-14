import { Injectable } from '@nestjs/common';
import { UserService } from '../database/user/service';
import { Api42Service } from '../api42/api42.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

	constructor(private userService: UserService,
			    private api42Service: Api42Service,
				private jwtService: JwtService) {}

	async signIn(code?: string): Promise<any> {
		if (!code) {
			return null;
		}

		let token = await this.api42Service.getTokenFromCode(code);
		let user_id = await this.api42Service.getIdFromToken(token);
		let user = await this.userService.returnOne(user_id);

		if (!user) {
			let user42 = await this.api42Service.getUserFromToken(token);
			user_id = await this.userService.create({
				ft_login: user42.login,
			});
		}
		const payload = { sub: user_id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
