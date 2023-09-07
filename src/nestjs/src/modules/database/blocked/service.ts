import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { BlockedEntity } from "./entity";
import { DBBlockedPost } from "./dto";
import { UserEntity } from "../user/entity";

@Injectable()
export class DBBlockedService {
	constructor(
		@InjectRepository(BlockedEntity)
		private readonly blockedRepo: Repository<BlockedEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: DBBlockedPost, meId: number) {
		const user1 = await this.userRepo.findOneBy({id: meId});
		const user2 = await this.userRepo.findOneBy({id: post.blockedId});
		if (!user1 || !user2)
			throw new NotFoundException("User not found");
		let list = new BlockedEntity();
		list.meId = meId;
		list.blockedId = post.blockedId;
		await this.blockedRepo.save(list);
		return list;
	}

	async returnAll() {
		return await this.blockedRepo.find();
	}

	async returnOne(me_id: number, blocked_id: number) {
		const tmp = await this.blockedRepo.findOneBy({ meId: me_id, blockedId: blocked_id });
		if (tmp) return tmp;
		else throw new NotFoundException("blocked relation not found");
	}

	async delete(me_id: number, blocked_id: number) {
		const tmp = await this.blockedRepo.findOneBy({ meId: me_id, blockedId: blocked_id });
		if (tmp) return await this.blockedRepo.delete({ meId: me_id, blockedId: blocked_id });
		else throw new NotFoundException("blocked relation not found");
	}
}
