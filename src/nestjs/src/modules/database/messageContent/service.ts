import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DBMessageContentPost } from "./dto";
import { MessageContentEntity } from "./entity";
import { MessageEntity } from "../message/entity";

@Injectable()
export class DBMessageContentService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepo: Repository<MessageEntity>,
		@InjectRepository(MessageContentEntity)
		private readonly messageContentRepo: Repository<MessageContentEntity>,
	) {}

	async create(messagePost: DBMessageContentPost, messageId: number) {
		const data = new MessageContentEntity();
		const message = await this.messageRepo.findBy({id: messageId});
		if (!message)
			throw new NotFoundException("Message not found");
		data.type = messagePost.type;
		data.content = messagePost.content;
		data.messageId = messageId;
		const id = await this.messageContentRepo.save(data);
		return (id);
	}

	async returnAll() {
		return await this.messageContentRepo.find();
	}

	async returnOne(messageId?: number) {
		const message = await this.messageContentRepo.findOneBy({ id: messageId });
		if (message) return await this.messageContentRepo.findOneBy({ id: messageId });
		else throw new NotFoundException("Message content not found");
	}

	async update(messageId: number, dbMessagePost: DBMessageContentPost) {
		const message = await this.messageContentRepo.findOneBy({ id: messageId });
		if (message)
			return await this.messageContentRepo.update(messageId, dbMessagePost);
		else throw new NotFoundException("Message content not found");
	}

	async delete(messageId: number) {
		const message = await this.messageContentRepo.findOneBy({ id: messageId });
		if (message) return await this.messageContentRepo.delete(messageId);
		else throw new NotFoundException("Message content not found");
	}

}
