import { Injectable } from "@nestjs/common";
import { DBUserService } from "../database/user/service";
import { Api42Service } from "../api42/service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private dbUserService: DBUserService,
		private api42Service: Api42Service,
		private jwtService: JwtService,
	) {}

	async ftSignIn(code?: string): Promise<any> {
		if (!code) {
			return null;
		}

		const token = await this.api42Service.getTokenFromCode(code);
		const login = await this.api42Service.getLoginFromToken(token);
		let user = await this.dbUserService.returnOne(null, login);

		if (!user) {
			const user42 = await this.api42Service.getUserFromToken(token);
			const user_id = await this.dbUserService.create({
				ftLogin: user42.login,
			});
			user = await this.dbUserService.returnOne(user_id);
		}
		const nonce = await this.dbUserService.getNonce(user.id);
		const payload = { sub: user.id };
		let status;
		if (user.twoAuthFactor) {
			return {
				status: "2fa",
				nonce: nonce,
			};
		}

		if (!user.nickname) status = "register";
		else status = "oke";

		return {
			access_token: await this.jwtService.signAsync(payload),
			status: status,
		};
	}

	async ftSignInTest(test: number): Promise<any> {
		let login = "norminet";
		let nickname = "leSangCho";
		if (test !== 0)
		{
			login += test;
			nickname += test;
		}
		let user = await this.dbUserService.returnOne(null, login);
		if (!user) {
			const user_id = await this.dbUserService.create({
				ftLogin: login,
			});
			await this.dbUserService.update(user_id, { nickname: nickname});
			user = await this.dbUserService.returnOne(user_id);
		}
		else
			return (await this.ftSignInTest(test + 1));

		console.log("test user created");
		return {
			access_token: await this.jwtService.signAsync({ sub: user.id }),
			status: "oke",
		};
	}

	async validateUser(payload: any): Promise<any> {
		return await this.dbUserService.returnOne(payload.sub);
	}

	async login(user: any) {
		const payload = { sub: user.id };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
