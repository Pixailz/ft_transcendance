import { Injectable, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { FriendRequestEntity } from "./entity";
import { DBFriendRequestPost } from "./dto";
import { UserEntity } from "../user/entity";

@Injectable()
export class DBFriendRequestService {
	constructor(
		@InjectRepository(FriendRequestEntity)
		private readonly friendRequestRepo: Repository<FriendRequestEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: DBFriendRequestPost, meId: number) {
		const user1 = await this.userRepo.findOneBy({id: meId});
		const user2 = await this.userRepo.findOneBy({id: post.friendId});
		if (!user1 || !user2)
			throw new ForbiddenException("User not found");
		let request = new FriendRequestEntity();
		request.meId = meId;
		request.friendId = post.friendId;
		await this.friendRequestRepo.save(request);
		return request;
	}

	async returnAll() {
		return await this.friendRequestRepo.find();
	}

	async returnOne(me_id: number, friendRequest_id: number) {
		const tmp = await this.friendRequestRepo.findOneBy({ meId: me_id, friendId: friendRequest_id });
		if (tmp) return tmp;
		else throw new ForbiddenException("FriendRequest relation not found");
	}

	async delete(me_id: number, friendRequest_id: number) {
		const tmp = await this.friendRequestRepo.findOneBy({ meId: me_id, friendId: friendRequest_id });
		if (tmp) return await this.friendRequestRepo.delete(tmp);
		else throw new ForbiddenException("FriendRequest relation not found");
	}
}