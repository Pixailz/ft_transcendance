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
				user: true,
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
		if (tmp)
			return await this.userChatRoomRepo.update(
				{ userId: tmp.userId, roomId: tmp.roomId },
				post,
			);
		else throw new NotFoundException("userChatRoom not found");
	}

	async mute(user: number, room: number, muted_time: number) {
		const user_chatroom = await this.getUserChatRoom(user, room);
		var demuteDate: Date = new Date();
		if (user_chatroom.isMuted && user_chatroom.demuteDate > demuteDate)
			demuteDate = user_chatroom.demuteDate;
		demuteDate.setSeconds(demuteDate.getSeconds() + muted_time);
		await this.update(user, room, {
			isMuted: true,
			demuteDate: demuteDate,
		});
	}

	async delete(user: number, room: number) {
		const tmp = await this.userChatRoomRepo.findOneBy({
			userId: user,
			roomId: room,
		});
		if (tmp)
			return await this.userChatRoomRepo.delete({
				userId: tmp.userId,
				roomId: tmp.roomId,
			});
	}

	async getUserRoom(room_id: number): Promise<UserChatRoomEntity[]> {
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

	async getAllChannelUserRoom(
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
				{
					roomId: room_id,
					room: {
						type: RoomType.PRIVATE,
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

	async getUserChatRoom(user_id: number, room_id: number) {
		return await this.userChatRoomRepo.findOne({
			relations: {
				user: true,
				room: true,
			},
			where: [
				{
					userId: user_id,
					roomId: room_id,
					room: {
						type: RoomType.PROTECTED,
					},
				},
				{
					userId: user_id,
					roomId: room_id,
					room: {
						type: RoomType.PUBLIC,
					},
				},
				{
					userId: user_id,
					roomId: room_id,
					room: {
						type: RoomType.PRIVATE,
					},
				},
			],
		});
	}
}
