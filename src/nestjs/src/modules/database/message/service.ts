import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { MessageEntity } from "./entity";
import { MessagePost } from "./dto";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepo: Repository<MessageEntity>,
	) {}

	async create(messagePost: MessagePost, UserId: number, RoomId: number) {
		const message = new MessageEntity();

		message.roomId = RoomId;
		message.userId = UserId;
		message.content = messagePost.content;

		await this.messageRepo.save(message);
		return message.id;
	}

	async returnAll() {
		return await this.messageRepo.find();
	}

	async returnOne(MessageId?: number) {
		if (MessageId) 
			return await this.messageRepo.findOneBy({ id: MessageId });
		return null;
	}

	async update(MessageId: number, MessagePost: MessagePost) {
		console.log(MessageId);
		console.log(MessagePost);
		return await this.messageRepo.update(MessageId, MessagePost);
	}

	async delete(MessageId: number) {
		console.log(MessageId);
		return await this.messageRepo.delete(MessageId);
	}
}
