import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserInfoEntity } from "./entity";
import { UserInfoPost } from "./dto";
import { Api42OAuthService } from "src/modules/api42OAuth/service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserInfoService {
	constructor(
		@InjectRepository(UserInfoEntity)
		private readonly userInfoRepo: Repository<UserInfoEntity>
	) {}

	async create(userInfoPost: UserInfoPost) {
		console.log(userInfoPost);
		return await this.userInfoRepo.save(userInfoPost);
	}

	async returnMe(req: Request) {
		const api = new Api42OAuthService(JwtService);
		const token = await api.getTokenJwt(req.headers["authorization"]);
		return await this.userInfoRepo.findOneBy({ id: token.id });
	}

	async returnAll() {
		return await this.userInfoRepo.find();
	}

	async returnOne(userInfoId: number) {
		console.log(userInfoId);
		return await this.userInfoRepo.findOneBy({ id: userInfoId });
	}

	async update(userId: number, userPost: UserInfoPost) {
		console.log(userId);
		console.log(userPost);
		return await this.userInfoRepo.update(userId, userPost);
	}

	async delete(userId: number) {
		console.log(userId);
		return await this.userInfoRepo.delete(userId);
	}
}
