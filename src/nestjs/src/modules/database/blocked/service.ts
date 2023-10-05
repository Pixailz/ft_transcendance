import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { BlockedEntity } from "./entity";
import { DBBlockedPost } from "./dto";
import { UserEntity } from "../user/entity";
import { Sanitize } from "../../../sanitize-object";

@Injectable()
export class DBBlockedService {
	constructor(
		@InjectRepository(BlockedEntity)
		private readonly blockedRepo: Repository<BlockedEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		private sanitize: Sanitize,
	) {}

	async create(post: DBBlockedPost) {
		const user1 = await this.userRepo.findOneBy({ id: post.meId });
		const user2 = await this.userRepo.findOneBy({ id: post.targetId });
		if (!user1 || !user2) throw new NotFoundException("User not found");
		let list = new BlockedEntity();
		list.meId = post.meId;
		list.targetId = post.targetId;
		await this.blockedRepo.save(list);
		return list;
	}

	async delete(me_id: number, target_id: number) {
		const tmp = await this.blockedRepo.findOneBy({
			meId: me_id,
			targetId: target_id,
		});
		if (tmp)
			return await this.blockedRepo.delete({
				meId: me_id,
				targetId: target_id,
			});
		else throw new NotFoundException("blocked relation not found");
	}

	async returnAll() {
		return await this.blockedRepo.find();
	}

	async returnOne(me_id: number, target_id: number): Promise<BlockedEntity> {
		const tmp = await this.blockedRepo.findOne({
			relations: {
				me: true,
				target: true,
			},
			where: {
				meId: me_id,
				targetId: target_id,
			},
		});
		if (!tmp) throw new NotFoundException("blocked relation not found");
		return {
			meId: me_id,
			me: this.sanitize.User(tmp.me),
			targetId: target_id,
			target: this.sanitize.User(tmp.target),
		};
	}

	async isBlocked(me_id: number, target_id: number) {
		const target = await this.blockedRepo.findOne({
			where: {
				meId: me_id,
				targetId: target_id,
			}
		});
		return target ? true : false;
	}

	async getAllBlocked(user_id: number): Promise<any[]>
	{
		const tmp = await this.blockedRepo.find({
			relations: {
				target: true,
				me: true,
			},
			where: [
				{ meId: user_id },
				{ targetId: user_id},
			],
		})
		var sanitized: any[] = [];
		for (var i = 0; i < tmp.length; i++)
		{
			sanitized.push({
				me: this.sanitize.User(tmp[i].me),
				target: this.sanitize.User(tmp[i].target),
			});
		}
		return (sanitized);
	}
}
