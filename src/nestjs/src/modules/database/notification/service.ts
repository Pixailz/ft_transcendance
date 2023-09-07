import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { NotificationEntity } from "./entity";
import { DBNotificationPost } from "./dto";

@Injectable()
export class DBNotificationService {
	constructor(
		@InjectRepository(NotificationEntity)
		private readonly NotificationRepo: Repository<NotificationEntity>,
	) {}

	async create(post: DBNotificationPost) {
		let notif = new NotificationEntity();
		notif.isDeleted = post.isDeleted;
		notif.isSeen = post.isSeen;
		notif.type = post.type;
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
			return await this.NotificationRepo.delete(tmp);
		else 
			throw new NotFoundException("Notification not found");
	}
}
