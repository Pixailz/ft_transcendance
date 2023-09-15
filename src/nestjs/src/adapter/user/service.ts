import { Injectable } from "@nestjs/common";
import { DBUserService } from "../../modules/database/user/service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../../modules/database/user/entity";
import { DBFriendService } from "src/modules/database/friend/service";
import { DBFriendRequestService } from "src/modules/database/friendRequest/service";
import { FriendRequestEntity } from "src/modules/database/friendRequest/entity";
import { DBBlockedService } from "src/modules/database/blocked/service";

@Injectable()
export class UserService {
	constructor(
		private jwtService: JwtService,
		private dbUserService: DBUserService,
		private dbFriendService: DBFriendService,
		private dbFriendRequestService: DBFriendRequestService,
		private dbBlockedService: DBBlockedService,
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
		const all_friend = await this.dbFriendService.returnAllFriend(user_id);
		const all_friend_without_blocked: UserEntity[] = [];

		for (var i = 0; i < all_friend.length; i++)
			all_friend_without_blocked.push(all_friend[i])
		return all_friend_without_blocked;
	}

	async getAllFriendRequest(user_id: number): Promise<FriendRequestEntity[]> {
		return await this.dbFriendRequestService.getAllRequest(user_id);
	}

	async getAllStatusFriend(user_id: number): Promise<any> {
		const all_friends = await this.getAllFriend(user_id);
		var all_friends_status = {};

		for (var i = 0; i < all_friends.length; i++)
			all_friends_status[all_friends[i].id] = all_friends[i].status;
		return all_friends_status;
	}

	async getInfoByLogin(user_login: string): Promise<UserEntity> {
		return await this.dbUserService.returnOne(null, user_login);
	}

	async setStatus(user_id: number, status: number) {
		await this.dbUserService.setStatus(user_id, status);
	}
}
