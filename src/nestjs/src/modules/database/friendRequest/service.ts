import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { FriendRequestEntity } from "./entity";
import { DBFriendRequestPost } from "./dto";
import { UserEntity } from "../user/entity";
import { DBFriendService } from "../friend/service";
import { FriendEntity } from "../friend/entity";
@Injectable()
export class DBFriendRequestService {
	constructor(
		@InjectRepository(FriendRequestEntity)
		private readonly friendRequestRepo: Repository<FriendRequestEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
		@Inject(DBFriendService)
		private readonly friendService: DBFriendService,
		@InjectRepository(FriendRequestEntity)
		private readonly friendRepo: Repository<FriendEntity>,
	) {}

	async create(post: DBFriendRequestPost, meId: number) {
		const user1 = await this.userRepo.findOneBy({ id: meId });
		const user2 = await this.userRepo.findOneBy({ id: post.friendId });
		if (!user1 || !user2) throw new NotFoundException("User not found");
		let tmp = await this.friendRequestRepo.findOneBy({
			meId: meId,
			friendId: post.friendId,
		});
		let tmp2 = await this.friendRepo.findOneBy({
			meId: meId,
			friendId: post.friendId,
		});
		if (tmp || tmp2) return tmp;
		let request = new FriendRequestEntity();
		request.meId = meId;
		request.friendId = post.friendId;
		await this.friendRequestRepo.save(request);
		return request;
	}

	async returnAll() {
		return await this.friendRequestRepo.find();
	}

	async returnOne(me_id: number, friendId: number) {
		const tmp = await this.friendRequestRepo.findOneBy({
			meId: me_id,
			friendId: friendId,
		});
		if (tmp) return tmp;
		else throw new NotFoundException("FriendRequest relation not found");
	}

	async delete(me_id: number, friendId: number) {
		const tmp = await this.friendRequestRepo.findOneBy({
			meId: me_id,
			friendId: friendId,
		});
		if (tmp) return await this.friendRequestRepo.delete(tmp);
		else throw new NotFoundException("FriendRequest relation not found");
	}

	async getFullRequest(
		user_id: number,
		friend_id: number,
	): Promise<FriendRequestEntity> {
		return await this.friendRequestRepo.findOne({
			relations: {
				friend: true,
				me: true,
			},
			where: [
				{
					friendId: user_id,
					meId: friend_id,
				},
				{
					friendId: friend_id,
					meId: user_id,
				},
			],
		});
	}

	async alreadyFriend(me_id: number, friend_id: number) {
		const tmp = await this.friendRepo.findOneBy({
			meId: me_id,
			friendId: friend_id,
		});
		if (tmp) return true;
		return false;
	}

	async alreadySent(me_id: number, friend_id: number) {
		const tmp = await this.friendRequestRepo.findOneBy({
			meId: me_id,
			friendId: friend_id,
		});
		if (tmp) return true;
		return false;
	}

	async getAllRequest(me_id: number) {
		const requests = await this.friendRequestRepo.find({
			relations: {
				me: true,
				friend: true,
			},
			where: [
				{ friendId: me_id},
				{ meId: me_id},
			]
		});
		return requests;
	}

	async acceptReq(me_id: number, friendId: number) {
		const req = await this.friendRequestRepo.findOneBy({
			meId: me_id,
			friendId: friendId,
		});
		if (req) {
			await this.friendService.create({ friendId: friendId }, me_id);
			await this.friendRequestRepo.delete(req);
		} else throw new NotFoundException("FriendRequest relation not found");
	}

	async rejectReq(me_id: number, friendId: number) {
		const req = await this.friendRequestRepo.findOneBy({
			meId: me_id,
			friendId: friendId,
		});
		if (req) await this.friendRequestRepo.delete(req);
		else throw new NotFoundException("FriendRequest relation not found");
	}
}
