import { DBUserChatRoomService } from "../userChatRoom/service";
import { UserChatRoomEntity } from "../userChatRoom/entity";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ForbiddenException } from "@nestjs/common";
import { DBModule } from "../database.module";

import { ChatRoomEntity } from "../chatRoom/entity";
import { UserEntity } from "../user/entity";
import { DBUserService } from "../user/service";
import { DBChatRoomService } from "../chatRoom/service";
import { DBMessageService } from "./service";
import { MessageEntity } from "./entity";

describe("DBmessageService", () => {
	let userChatRoomservice: DBUserChatRoomService;
	let userService: DBUserService;
	let service: DBMessageService;
	let repo: Repository<MessageEntity>;
	let chatRoomRepo: Repository<ChatRoomEntity>;
	let chatRoomService: DBChatRoomService;
	let userChatRoomrepo: Repository<UserChatRoomEntity>;
	let unit_user: string = "UNIT_USER";
	let unit_room: string = "UNIT_ROOM";

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [DBModule],
			providers: [
				DBUserChatRoomService,
				{
					provide: getRepositoryToken(UserChatRoomEntity),
					useClass: Repository,
				},
				DBUserService,
				{
					provide: getRepositoryToken(UserEntity),
					useClass: Repository,
				},
				DBChatRoomService,
				{
					provide: getRepositoryToken(ChatRoomEntity),
					useClass: Repository,
				},
				DBUserService,
				{
					provide: getRepositoryToken(MessageEntity),
					useClass: Repository,
				},
			],
		}).compile();

		userChatRoomservice = module.get<DBUserChatRoomService>(
			DBUserChatRoomService,
		);
		userChatRoomrepo = module.get<Repository<UserChatRoomEntity>>(
			getRepositoryToken(UserChatRoomEntity),
		);
		userService = module.get<DBUserService>(DBUserService);
		chatRoomRepo = module.get<Repository<ChatRoomEntity>>(
			getRepositoryToken(ChatRoomEntity),
		);
		chatRoomService = module.get<DBChatRoomService>(DBChatRoomService);
		service = module.get<DBMessageService>(DBMessageService);
		repo = module.get<Repository<MessageEntity>>(
			getRepositoryToken(MessageEntity),
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("testing create and returnOne", () => {
		it("[MESSAGE] Create new message", async () => {
			const user_test = await userService.returnAll();
			let len = 0;
			if (user_test.length != 1) {
				len = user_test.length;
				unit_user += len - 2;
			}
			const room_test = await chatRoomService.returnAll();
			if (room_test.length != 1) {
				len = room_test.length;
				unit_room += len - 2;
			}
			const userId = (await userService.returnOne(null, unit_user)).id;
			const roomId = (
				await chatRoomRepo.findOneBy({ name: unit_room + "_name_BIS" })
			).id;
			const post = { content: "Hi test create" };
			let messId = await service.create(post, userId, roomId);
			const message = await service.returnOne(messId);
			expect(message.id).toEqual(messId);
			expect(message.content).toEqual(post.content);
			await expect(service.create(post, -1, roomId)).rejects.toThrowError(
				new ForbiddenException("User not found"),
			);
			await expect(service.create(post, userId, -1)).rejects.toThrowError(
				new ForbiddenException("ChatRoom not found"),
			);
		});
	});

	describe("[MESSAGE] Delete message", () => {
		it("should delete a room", async () => {
			const user = await userService.returnOne(null, unit_user);
			let room_name = unit_room + "_name_BIS";
			const room = await chatRoomRepo.findOneBy({ name: room_name });
			const messId = await service.create(
				{ content: "UNIT TEST" },
				user.id,
				room.id,
			);
			let message = await service.returnOne(messId);
			expect(message.content).toEqual("UNIT TEST");
			await service.delete(messId);
			await expect(service.returnOne(messId)).rejects.toThrowError(
				new ForbiddenException("Message not found"),
			);
		});
	});

	describe("[MESSAGE] on delete set null", () => {
		it("should delete a room", async () => {
			const userId = await userService.create({
				ftLogin: "Message test cascade",
			});
			const tmpRoomId = await chatRoomService.create({
				name: unit_user + "Cascade test",
			});
			const messId = await service.create(
				{ content: "UNIT CASCADE TEST" },
				userId,
				tmpRoomId,
			);
			let message = await service.returnOne(messId);
			expect(message.content).toEqual("UNIT CASCADE TEST");
			expect(message.userId).toEqual(userId);
			expect(message.roomId).toEqual(tmpRoomId);
			await userService.delete(userId);
			message = await service.returnOne(messId);
			expect(message.userId).toBeNull();
			await chatRoomService.delete(tmpRoomId);
			message = await service.returnOne(messId);
			expect(message.roomId).toBeNull();
		});
	});
});
