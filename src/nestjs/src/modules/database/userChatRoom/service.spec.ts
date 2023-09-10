import { DBUserChatRoomService } from "./service";
import { UserChatRoomEntity } from "./entity";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ForbiddenException } from "@nestjs/common";
import { DBModule } from "../database.module";

import { ChatRoomEntity } from "../chatRoom/entity";
import { UserEntity } from "../user/entity";
import { DBUserService } from "../user/service";
import { DBChatRoomService } from "../chatRoom/service";
import { Sanitize } from "../../../sanitize-object";

describe("DBUserChatRoomService", () => {
	let service: DBUserChatRoomService;
	let userService: DBUserService;
	let chatRoomRepo: Repository<ChatRoomEntity>;
	let chatRoomService: DBChatRoomService;
	let repo: Repository<UserChatRoomEntity>;
	let unit_user: string = "UNIT_USER";
	let unit_room: string = "UNIT_ROOM";

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [DBModule],
			providers: [
				Sanitize,
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
			],
		}).compile();

		service = module.get<DBUserChatRoomService>(DBUserChatRoomService);
		repo = module.get<Repository<UserChatRoomEntity>>(
			getRepositoryToken(UserChatRoomEntity),
		);
		userService = module.get<DBUserService>(DBUserService);
		chatRoomRepo = module.get<Repository<ChatRoomEntity>>(
			getRepositoryToken(ChatRoomEntity),
		);
		chatRoomService = module.get<DBChatRoomService>(DBChatRoomService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("testing create and returnOne", () => {
		it("[USER CHAT ROOM] TEST", async () => {
			const user_test = await userService.returnAll();
			let len = 0;
			// console.log('array user len = ', user_test.length)
			if (user_test.length != 1) {
				len = user_test.length;
				unit_user += len - 2;
			}
			const room_test = await chatRoomService.returnAll();
			if (room_test.length != 1) {
				len = room_test.length;
				unit_room += len - 2;
			}
			let user = await userService.returnOne(null, unit_user);
			let room = await chatRoomRepo.findOneBy({
				name: unit_room + "_name_BIS",
			});
			let post = { isOwner: true, isAdmin: true };
			// TODO: REDO
			// let tmp = await service.create(post, user.id, room.id);
			// expect(tmp.isOwner).toEqual(true);
			// expect(tmp.isAdmin).toEqual(true);

			// await expect(service.create(post, -1, 1)).rejects.toThrowError(
			// 	new ForbiddenException("User not found"),
			// );
			// await expect(service.create(post, 1, -1)).rejects.toThrowError(
			// 	new ForbiddenException("ChatRoom not found"),
			// );

			// post = { isOwner: false, isAdmin: false };
			// await service.update(user.id, room.id, post);
			// tmp = await service.returnOne(user.id, room.id);
			// expect(tmp.isOwner).toEqual(false);
			// expect(tmp.isAdmin).toEqual(false);
		});

		describe("[USER CHAT ROOM] delete", () => {
			it("should delete a room", async () => {
				const room = await chatRoomRepo.findOneBy({
					name: unit_room + "_name_BIS",
				});
				const user = await userService.returnOne(null, unit_user);
				// TODO: REDO
				// await service.delete(user.id, room.id);
				await expect(
					service.returnOne(user.id, room.id),
				).rejects.toThrowError(
					new ForbiddenException("userChatRoom not found"),
				);
			});
		});
		describe("[USER CHAT ROOM] delete on cascade", () => {
			it("should delete a room", async () => {
				const roomId = await chatRoomService.create({
					name: unit_room + "TEST_CASCADE",
				});
				let userId = await userService.create({
					ftLogin: unit_user + "CASCADE",
				});
				let post = { isOwner: true, isAdmin: true };
				let tmp = await service.create(post, userId, roomId);
				expect(tmp.isOwner).toEqual(true);
				await userService.delete(userId);
				await expect(
					service.returnOne(userId, roomId),
				).rejects.toThrowError(
					new ForbiddenException("userChatRoom not found"),
				);
				userId = await userService.create({
					ftLogin: unit_user + "CASCADE_TEST",
				});
				tmp = await service.create(post, userId, roomId);
				expect(tmp.isOwner).toEqual(true);
				await chatRoomService.delete(roomId);
				await expect(
					service.returnOne(userId, roomId),
				).rejects.toThrowError(
					new ForbiddenException("userChatRoom not found"),
				);
				await userService.delete(userId);
			});
		});
	});
});
