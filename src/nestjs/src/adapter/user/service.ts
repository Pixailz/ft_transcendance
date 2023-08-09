import { Injectable } from "@nestjs/common";
import { DBUserService } from "../../modules/database/user/service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../../modules/database/user/entity";

@Injectable()
export class UserService {
	constructor(
		private jwtService: JwtService,
		private dbUserService: DBUserService,
	) {}

	validateToken(jwt_token: string): boolean {
		if (!jwt_token) return false;
		try {
			this.jwtService.verify(jwt_token);
			return true;
		} catch {
			return false;
		}
	}

	decodeToken(jwt_token: string): number {
		if (!this.validateToken(jwt_token)) return -1;
		return this.jwtService.decode(jwt_token).sub;
	}

	async getInfoById(user_id: number): Promise<UserEntity> {
		return await this.dbUserService.returnOne(user_id);
	}

	async getAllFriend(user_id: number): Promise<UserEntity[]> {
		return await this.dbUserService.returnAll();
	}

	async getInfoByLogin(user_login: string): Promise<UserEntity> {
		return await this.dbUserService.returnOne(null, user_login);
	}
}
