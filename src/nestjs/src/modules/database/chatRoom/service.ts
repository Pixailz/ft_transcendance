import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ChatRoomEntity, RoomType } from "./entity";
import { DBChatRoomPost, DBChatRoomTypePost } from "./dto";

@Injectable()
export class DBChatRoomService {
	constructor(
		@InjectRepository(ChatRoomEntity)
		private readonly chatRoomRepo: Repository<ChatRoomEntity>,
	) {}

	async create(post: DBChatRoomPost) {
		const room = new ChatRoomEntity();
		room.name = post.name;
		room.password = post.password;
		await this.chatRoomRepo.save(room);
		return room.id;
	}

	async returnAll() {
		return await this.chatRoomRepo.find();
	}

	async returnOne(chatId: number) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp) return tmp;
		else throw new NotFoundException("ChatRoom not found");
	}

	async update(chatId: number, post: DBChatRoomPost) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp) return await this.chatRoomRepo.update(chatId, post);
		else throw new NotFoundException("ChatRoom not found");
	}

	async updateType(chatId: number, post: DBChatRoomTypePost) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp) return await this.chatRoomRepo.update(chatId, post);
		else throw new NotFoundException("ChatRoom not found");
	}

	async delete(chatId: number) {
		const tmp = await this.chatRoomRepo.findOneBy({ id: chatId });
		if (tmp) return await this.chatRoomRepo.delete(chatId);
		else throw new NotFoundException("ChatRoom not found");
	}

	async getAllRoom(user_id: number): Promise<ChatRoomEntity[]> {
		return await this.chatRoomRepo.find({
			relations: {
				roomInfo: {
					user: true,
				},
				message: true,
			},
			where: {
				roomInfo: {
					userId: user_id,
				},
			},
			order: {
				message: {
					updateAt: "ASC",
				},
			},
		});
	}

	async getDmRoom(room_id: number): Promise<ChatRoomEntity> {
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
				id: room_id,
				type: RoomType.DIRECT_MSG,
			},
			order: {
				message: {
					updateAt: "ASC",
				},
			},
		});
	}

	async getAllDmRoom(user_id: number): Promise<ChatRoomEntity[]> {
		return await this.chatRoomRepo.find({
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
					userId: user_id,
				},
				type: RoomType.DIRECT_MSG,
			},
			order: {
				message: {
					updateAt: "ASC",
				},
			},
		});
	}

	async getAllAvailableChannelRoom(): Promise<ChatRoomEntity[]> {
		return await this.chatRoomRepo.find({
			relations: {
				roomInfo: {
					user: true,
				},
			},
			where: [{ type: RoomType.PUBLIC }, { type: RoomType.PROTECTED }],
		});
	}

	async getAvailableChannelRoom(room_id: number): Promise<ChatRoomEntity> {
		return await this.chatRoomRepo.findOne({
			relations: {
				roomInfo: {
					user: true,
				},
			},
			where: [
				{
					id: room_id,
					type: RoomType.PUBLIC,
				},
				{
					id: room_id,
					type: RoomType.PROTECTED,
				},
			],
		});
	}

	async getJoinedChannelRoom(room_id: number): Promise<ChatRoomEntity> {
		return await this.chatRoomRepo.findOne({
			relations: {
				roomInfo: {
					user: true,
				},
				message: {
					user: true,
				},
			},
			where: [
				{
					id: room_id,
					type: RoomType.PUBLIC,
				},
				{
					id: room_id,
					type: RoomType.PROTECTED,
				},
				{
					id: room_id,
					type: RoomType.PRIVATE,
				},
			],
		});
	}

	async getAllJoinedChannelRoom(user_id: number): Promise<ChatRoomEntity[]> {
		return await this.chatRoomRepo.find({
			relations: {
				roomInfo: {
					user: true,
				},
				message: {
					user: true,
				},
			},
			where: [
				{
					roomInfo: {
						user: {
							id: user_id,
						},
						isBanned: false,
					},
					type: RoomType.PUBLIC,
				},
				{
					roomInfo: {
						user: {
							id: user_id,
						},
						isBanned: false,
					},
					type: RoomType.PROTECTED,
				},
				{
					roomInfo: {
						user: {
							id: user_id,
						},
						isBanned: false,
					},
					type: RoomType.PRIVATE,
				},
			],
		});
	}

	async getAllRoomByType(user_id: number, room_type: RoomType[]) {
		const all_room = await this.getAllRoom(user_id);
		return this.filterRoomType(all_room, room_type);
	}

	filterRoomType(room: ChatRoomEntity[], room_type: RoomType[]) {
		var spliced: number = 0;

		for (var i = 0; room.length; i++)
			if (!this.isRoomType(room[i], room_type))
				room.splice(i - spliced++, 1);
		return room;
	}

	isRoomType(room: ChatRoomEntity, room_type: RoomType[]) {
		for (var i = 0; room_type.length; i++)
			if (room.type === room_type[i]) return true;
		return false;
	}
}
