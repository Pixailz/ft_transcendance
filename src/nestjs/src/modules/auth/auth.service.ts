import { Injectable } from "@nestjs/common";
import { UserService } from "../database/user/service";
import { Api42Service } from "../api42/api42.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private api42Service: Api42Service,
		private jwtService: JwtService,
	) {}

	async ftSignIn(code?: string): Promise<any> {
		if (!code) {
			return null;
		}

		const token = await this.api42Service.getTokenFromCode(code);
		const login = await this.api42Service.getLoginFromToken(token);
		let user = await this.userService.returnOne(null, login);

		if (!user) {
			const user42 = await this.api42Service.getUserFromToken(token);
			const user_id = await this.userService.create({
				ftLogin: user42.login,
			});
			user = await this.userService.returnOne(user_id);
		}
		const payload = { sub: user.id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}

	async validateUser(payload: any): Promise<any> {
		return await this.userService.returnOne(payload.sub);
	}

	async login(user: any) {
		const payload = { sub: user.id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
