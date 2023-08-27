import { Injectable, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ChatRoomEntity, RoomType } from "./entity";
import { DBChatRoomPost } from "./dto";

@Injectable()
export class DBChatRoomService {
	constructor(
		@InjectRepository(ChatRoomEntity)
		private readonly chatRoomRepo: Repository<ChatRoomEntity>,
	) {}

	async create(post: DBChatRoomPost) {
		const room = new ChatRoomEntity();
		room.name = post.name;
		room.type = post.type;
		room.password = post.password;
		await this.chatRoomRepo.save(room);
		return room.id;
	}

	async returnAll() {
		return await this.chatRoomRepo.find();
	}

	async returnOne(chatId: number) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp)
			return tmp;
		else
			throw new ForbiddenException("ChatRoom not found");
	}

	async update(chatId: number, post: DBChatRoomPost) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp)
			return await this.chatRoomRepo.update(chatId, post);
		else
			throw new ForbiddenException("ChatRoom not found");
	}

	async delete(chatId: number) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp)
			return await this.chatRoomRepo.delete(chatId);
		else
			throw new ForbiddenException("ChatRoom not found");
	}

	async getAllPrivateRoom(chatId: number): Promise<ChatRoomEntity> {
		return await this.chatRoomRepo.findOne({
			relations: {
				message: {
					user: true,
				},
				roomInfo: {
					user: true,
				},
			},
			where: {
				roomInfo: {
					roomId: chatId,
				},
			},
			order: {
				message: {
					updateAt: "ASC",
				},
			},
		});
	}
}
