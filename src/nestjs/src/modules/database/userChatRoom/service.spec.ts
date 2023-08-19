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
			// console.log('array user len = ', user_test.length)
			if (user_test.length != 1) {
				const len = user_test.length;
				unit_user += len - 2;
			}
			const room_test = await chatRoomService.returnAll();
			if (room_test.length != 1) {
				const len = room_test.length;
				unit_room += len - 2;
			}
			let user = await userService.returnOne(null, unit_user);
			let room = await chatRoomRepo.findOneBy({
				name: unit_room + "_name",
			});

			const post = { isOwner: true, isAdmin: true };
			const tmp = await service.create(post, user.id, room.id);
			expect(tmp.isOwner).toEqual(post.isOwner);
		});
	});
});
