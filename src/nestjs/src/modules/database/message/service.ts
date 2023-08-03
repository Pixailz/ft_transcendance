import { Injectable, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { MessageEntity } from "./entity";
import { MessagePost } from "./dto";
import { ChatRoomEntity } from "../chatRoom/entity";
import { UserEntity } from "../user/entity";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepo: Repository<MessageEntity>,
		@InjectRepository(ChatRoomEntity)
		private readonly chatRoomRepo: Repository<ChatRoomEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(messagePost: MessagePost, UserId: number, RoomId: number) {
		const message = new MessageEntity();
		const room = await this.chatRoomRepo.findOneBy({ id: RoomId });
		const user = await this.userRepo.findOneBy({ id: UserId });
		if (room) message.roomId = RoomId;
		else throw new ForbiddenException("ChatRoom not found");
		if (user) message.userId = UserId;
		else throw new ForbiddenException("User not found");
		message.content = messagePost.content;
		await this.messageRepo.save(message);
		return message.id;
	}

	async returnAll() {
		return await this.messageRepo.find();
	}

	async returnOne(MessageId?: number) {
		const message = await this.messageRepo.findOneBy({ id: MessageId });
		if (message) return await this.messageRepo.findOneBy({ id: MessageId });
		else throw new ForbiddenException("Message not found");
	}

	async update(MessageId: number, MessagePost: MessagePost) {
		const message = await this.messageRepo.findOneBy({ id: MessageId });
		if (message)
			return await this.messageRepo.update(MessageId, MessagePost);
		else throw new ForbiddenException("Message not found");
	}

	async delete(MessageId: number) {
		const message = await this.messageRepo.findOneBy({ id: MessageId });
		if (message) return await this.messageRepo.delete(MessageId);
		else throw new ForbiddenException("Message not found");
	}
}
