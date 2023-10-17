import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DBMessagePost } from "./dto";
import { MessageEntity } from "./entity";
import { ChatRoomEntity } from "../chatRoom/entity";
import { UserEntity } from "../user/entity";

@Injectable()
export class DBMessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepo: Repository<MessageEntity>,
		@InjectRepository(ChatRoomEntity)
		private readonly chatRoomRepo: Repository<ChatRoomEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(userId: number, roomId: number) {
		const message = new MessageEntity();
		const room = await this.chatRoomRepo.findOneBy({ id: roomId });
		const user = await this.userRepo.findOneBy({ id: userId });
		if (room) message.roomId = roomId;
		else throw new NotFoundException("ChatRoom not found");
		if (user) message.userId = userId;
		else throw new NotFoundException("User not found");
		await this.messageRepo.save(message);
		return message.id;
	}

	async returnAll() {
		return await this.messageRepo.find();
	}

	async returnOne(messageId?: number) {
		const message = await this.messageRepo.findOneBy({ id: messageId });
		if (message) return await this.messageRepo.findOneBy({ id: messageId });
		else throw new NotFoundException("Message not found");
	}

	// async update(messageId: number, dbMessagePost: DBMessagePost) {
	// 	const message = await this.messageRepo.findOneBy({ id: messageId });
	// 	if (message)
	// 		return await this.messageRepo.update(messageId, dbMessagePost);
	// 	else throw new NotFoundException("Message not found");
	// }

	async delete(messageId: number) {
		const message = await this.messageRepo.findOneBy({ id: messageId });
		if (message) return await this.messageRepo.delete(messageId);
		else throw new NotFoundException("Message not found");
	}

	async getMessage(message_id: number): Promise<MessageEntity> {
		return await this.messageRepo.findOne({
			relations: {
				user: true,
				content: true,
			},
			where: {
				id: message_id,
			},
		});
	}
}
