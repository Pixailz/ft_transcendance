import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { NotificationEntity } from "./entity";
import { DBNotificationPost } from "./dto";
import { DBUserService } from "../user/service";

@Injectable()
export class DBNotificationService {
	constructor(
		@InjectRepository(NotificationEntity)
		private readonly NotificationRepo: Repository<NotificationEntity>,
		private readonly dbUserService: DBUserService,
	) {}

	async create(post: DBNotificationPost, destUserId: number) {
		const user = await this.dbUserService.returnOne(destUserId);
		if (!user)
			throw new NotFoundException("User not found");
		let notif = new NotificationEntity();
		notif.isDeleted = post.isDeleted;
		notif.isSeen = post.isSeen;
		notif.type = post.type;
		
		notif.userId = destUserId;
		// active relation for later
		// notif.user = user;
		//
		const ret = await this.NotificationRepo.save(notif);
		// console.log('notice.user.ftLogin', ret.user.ftLogin);
		return (ret);
	}

	async update(id: number, post: DBNotificationPost) {
		const tmp = await this.NotificationRepo.findOneBy({id: id});
		if (tmp)
			await this.NotificationRepo.update(id, post);
		else
			throw new NotFoundException("Notification not found");
	}

	async returnAll() {
		return await this.NotificationRepo.find();
	}

	async returnOne(id: number) {
		const tmp = await this.NotificationRepo.findOneBy({id: id});
		if (tmp)
			return (tmp);
		else
			throw new NotFoundException("Notification not found");
	}

	async delete(id: number) {
		const tmp = await this.NotificationRepo.findOneBy({id: id});
		if (tmp) 
			return await this.NotificationRepo.delete(tmp.id);
		else 
			throw new NotFoundException("Notification not found");
	}

	async getNotifByUserId(id: number)
	{
		const ret = await this.NotificationRepo.find({
			relations: {
				user: true,
			},
			where: {
				userId: id,
			},
			order: {
				createdAt: "ASC",
			},
		});
		if (ret)
			return (ret);
		throw new NotFoundException("Notification not found");
	}
}
