import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { NotificationEntity, NotificationType } from "./entity";
import { DBNotificationPost } from "./dto";

@Injectable()
export class DBNotificationService {
	constructor(
		@InjectRepository(NotificationEntity)
		private readonly NotificationRepo: Repository<NotificationEntity>,
	) {}

	async create(post: DBNotificationPost) {
		let notif = new NotificationEntity();
		notif.type = post.type;
		notif.userId = post.userId;
		notif.data = post.data;
		const ret = await this.NotificationRepo.save(notif);
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

	async getNotif(user_id: number, data?: string, type?: NotificationType)
	{
		var where_query: any = {
			userId: user_id,
		}
		if (data) where_query["data"] = data;
		if (type) where_query["type"] = type;
		return await this.NotificationRepo.findOne({
			where: where_query,
			order: {
				createdAt: "ASC",
			},
		});
	}

	async getNotifByUserId(id: number)
	{
		return await this.NotificationRepo.find({
			where: {
				userId: id,
			},
			order: {
				createdAt: "ASC",
			},
		});
	}
}
