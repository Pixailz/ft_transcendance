import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserChatRoomEntity } from "./entity";
import { UserEntity } from "../user/entity";
import { ChatRoomEntity, RoomType } from "../chatRoom/entity";

import { DBUserChatRoomPost } from "./dto";

@Injectable()
export class DBUserChatRoomService {
	constructor(
		@InjectRepository(UserChatRoomEntity)
		private readonly userChatRoomRepo: Repository<UserChatRoomEntity>,
		@InjectRepository(ChatRoomEntity)
		private readonly chatRoomRepo: Repository<ChatRoomEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,
	) {}

	async create(post: DBUserChatRoomPost, userId: number, roomId: number) {
		const userChat = new UserChatRoomEntity();
		let user = await this.userRepo.findOneBy({ id: userId });
		if (user) userChat.userId = userId;
		else throw new NotFoundException("User not found");
		let room = await this.chatRoomRepo.findOneBy({ id: roomId });
		if (room) userChat.roomId = roomId;
		else throw new NotFoundException("ChatRoom not found");
		userChat.isOwner = post.isOwner;
		userChat.isAdmin = post.isAdmin;
		return await this.userChatRoomRepo.save(userChat);
	}

	async returnAll() {
		return await this.userChatRoomRepo.find();
	}

	async returnOne(user: number, room: number) {
		const tmp = await this.userChatRoomRepo.findOneBy({
			userId: user,
			roomId: room,
		});
		if (tmp) return tmp;
		else throw new NotFoundException("userChatRoom not found");
	}

	async returnOneWithUser(user: number, room: number) {
		const tmp = await this.userChatRoomRepo.findOne({
			relations: {
				user: true
			},
			where: {
				userId: user,
				roomId: room,
			},
		});
		if (tmp) return tmp;
		else throw new NotFoundException("userChatRoom not found");
	}

	async update(user: number, room: number, post: DBUserChatRoomPost) {
		const tmp = await this.userChatRoomRepo.findOneBy({
			userId: user,
			roomId: room,
		});
		if (tmp) return await this.userChatRoomRepo.update(tmp, post);
		else throw new NotFoundException("userChatRoom not found");
	}

	async delete(user: number, room: number) {
		const tmp = await this.userChatRoomRepo.findOneBy({
			userId: user,
			roomId: room,
		});
		if (tmp) return await this.userChatRoomRepo.delete(tmp);
		else throw new NotFoundException("userChatRoom not found");
	}

	async getAllPrivateRoom(userId: number): Promise<ChatRoomEntity[]> {
		return await this.chatRoomRepo.find({
			relations: {
				roomInfo: {
					user: true,
				},
				message: true,
			},
			where: {
				roomInfo: {
					user: {
						id: userId,
					},
				},
				type: RoomType.PRIVATE,
			},
			order: {
				message: {
					updateAt: "ASC",
				},
			},
		});
	}

	async getAllPrivateUserRoom(
		room_id: number,
	): Promise<UserChatRoomEntity[]> {
		return await this.userChatRoomRepo.find({
			relations: {
				user: true,
				room: {
					message: {
						user: true,
					},
				},
			},
			where: {
				roomId: room_id,
			},
			order: {
				room: {
					message: {
						updateAt: "ASC",
					},
				},
			},
		});
	}

	async getAllGlobalUserRoom(room_id: number): Promise<UserChatRoomEntity[]> {
		return await this.userChatRoomRepo.find({
			relations: {
				user: true,
				room: {
					message: {
						user: true,
					},
				},
			},
			where: [
				{
					roomId: room_id,
					room: {
						type: RoomType.PROTECTED,
					},
				},
				{
					roomId: room_id,
					room: {
						type: RoomType.PUBLIC,
					},
				},
			],
			order: {
				room: {
					message: {
						updateAt: "ASC",
					},
				},
			},
		});
	}

	async getAllAvailableGlobalRoom(): Promise<ChatRoomEntity[]> {
		return await this.chatRoomRepo.find({
			relations: {
				roomInfo: {
					user: true,
				},
			},
			where: [
				{
					type: RoomType.PUBLIC,
				},
				{
					type: RoomType.PROTECTED,
				},
			],
		});
	}

	async getAvailableGlobalRoom(room_id: number): Promise<ChatRoomEntity> {
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

	async getJoinedGlobalRoom(room_id: number): Promise<ChatRoomEntity> {
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
			],
		});
	}

	async getAllJoinedGlobalRoom(user_id: number): Promise<ChatRoomEntity[]> {
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
					},
					type: RoomType.PUBLIC,
				},
				{
					roomInfo: {
						user: {
							id: user_id,
						},
					},
					type: RoomType.PROTECTED,
				},
			],
		});
	}

	async returnAllUserFromRoom(room_id: number): Promise<number[]> {
		var user_ids = [];

		const query = await this.getAllPrivateUserRoom(room_id);
		for (var i = 0; i < query.length; i++) user_ids.push(query[i].user.id);
		return user_ids;
	}
}
