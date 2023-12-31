import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { FriendEntity } from "./entity";
import { DBFriendPost } from "./dto";
import { UserEntity } from "../user/entity";
import { Sanitize } from "../sanitize-object";

@Injectable()
export class DBFriendService {
	constructor(
		@InjectRepository(FriendEntity)
		private readonly friendRepo: Repository<FriendEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		private sanitize: Sanitize,
	) {}

	async create(post: DBFriendPost, meId: number) {
		const user1 = await this.userRepo.findOneBy({ id: meId });
		const user2 = await this.userRepo.findOneBy({ id: post.friendId });
		if (!user1 || !user2) throw new NotFoundException("User not found");
		let list = new FriendEntity();
		list.meId = meId;
		list.friendId = post.friendId;
		await this.friendRepo.save(list);
		// maybe create reverse table //
		let tmp = new FriendEntity();
		tmp.meId = list.friendId;
		tmp.friendId = list.meId;
		await this.friendRepo.save(tmp);
		return list;
	}

	async alreadyFriend(me_id: number, friend_id: number) {
		const friend = await this.friendRepo.findOneBy({
			meId: me_id,
			friendId: friend_id,
		});
		return friend ? true : false;
	}

	async returnAll() {
		return await this.friendRepo.find();
	}

	async returnOne(me_id: number, friend_id: number) {
		const tmp = await this.friendRepo.findOneBy({
			meId: me_id,
			friendId: friend_id,
		});
		if (tmp) return tmp;
		else throw new NotFoundException("Friend relation not found");
	}

	async returnAllFriend(me_id: number): Promise<UserEntity[]> {
		const tmp = await this.friendRepo.find({
			relations: {
				friend: true,
			},
			where: {
				meId: me_id,
			},
		});
		var user_list: UserEntity[] = [];

		for (var i = 0; i < tmp.length; i++)
			user_list.push(this.sanitize.User(tmp[i].friend));
		return user_list;
	}

	async delete(me_id: number, friend_id: number) {
		const tmp = await this.friendRepo.findOneBy({
			meId: me_id,
			friendId: friend_id,
		});
		if (tmp) return await this.friendRepo.delete({
			meId: me_id,
			friendId: friend_id,
		});
		else
			return ;

	}
}
