import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { MutedEntity } from "./entity";
import { DBMutedPost } from "./dto";
import { UserEntity } from "../user/entity";

@Injectable()
export class DBMutedService {
	constructor(
		@InjectRepository(MutedEntity)
		private readonly mutedRepo: Repository<MutedEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: DBMutedPost, meId: number) {
		const user1 = await this.userRepo.findOneBy({id: meId});
		const user2 = await this.userRepo.findOneBy({id: post.mutedId});
		if (!user1 || !user2)
			throw new NotFoundException("User not found");
		let list = new MutedEntity();
		list.meId = meId;
		list.mutedId = post.mutedId;
		await this.mutedRepo.save(list);
		return list;
	}

	async returnAll() {
		return await this.mutedRepo.find();
	}

	async returnOne(me_id: number, Muted_id: number) {
		const tmp = await this.mutedRepo.findOneBy({ meId: me_id, mutedId: Muted_id });
		if (tmp) return tmp;
		else throw new NotFoundException("Muted relation not found");
	}

	// async update(me_id: number, Muted_id: number, post: DBMutedPost) {
	// 	const tmp = await this.mutedRepo.findOneBy({ meId: me_id, MutedId: Muted_id });
	// 	if (tmp) return await this.mutedRepo.update(tmp, post);
	// 	else throw new NotFoundException("Muted relation not found");
	// }

	async delete(me_id: number, Muted_id: number) {
		const tmp = await this.mutedRepo.findOneBy({ meId: me_id, mutedId: Muted_id });
		if (tmp) return await this.mutedRepo.delete(tmp);
		else throw new NotFoundException("Muted relation not found");
	}
}
