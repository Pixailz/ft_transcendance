import { DBChatRoomService } from "./service";
import { ChatRoomEntity, RoomType } from "./entity";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ForbiddenException } from "@nestjs/common";
import { DBModule } from "../database.module";
import { DBUserService } from "../user/service";
import { DBUserChatRoomService } from "../userChatRoom/service";

describe("DBChatRoomService", () => {
	let service: DBChatRoomService;
	let repo: Repository<ChatRoomEntity>;
	let userService: DBUserService;
	let userChatRoomService: DBUserChatRoomService;
	let unit_room: string = "UNIT_ROOM";
	let unit_room_bis = unit_room + "_BIS";

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [DBModule],
			providers: [
				DBChatRoomService,
				{
					provide: getRepositoryToken(ChatRoomEntity),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<DBChatRoomService>(DBChatRoomService);
		userService = module.get<DBUserService>(DBUserService);
		userChatRoomService = module.get<DBUserChatRoomService>(DBUserChatRoomService);
		repo = module.get<Repository<ChatRoomEntity>>(
			getRepositoryToken(ChatRoomEntity),
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("testing create and returnOne", () => {
		it("[CHATROOM] should create 2 room and update", async () => {
			const test = await service.returnAll();
			if (test.length != 0) {
				const len = test.length;
				unit_room += len - 1;
				unit_room_bis = unit_room + "_BIS";
			}
			const roomPost = { name: unit_room };
			const roomPost2 = { name: unit_room_bis };

			let roomId = await service.create(roomPost);
			let room = await service.returnOne(roomId);
			expect(roomId).toEqual(room.id);
			let roomId2 = await service.create(roomPost2);
			let room2 = await service.returnOne(roomId2);
			expect(roomId2).toEqual(room2.id);
		});
	});

	describe("update", () => {
		it("[CHATROOM] should update 2 room", async () => {
			const roomPost = { name: unit_room + "_name", type: RoomType.PRIVATE };
			const roomPost2 = {
				name: unit_room + "_name_BIS",
				type: RoomType.PRIVATE,
			};
			let room_id = (await repo.findOne({ where: { name: unit_room } })).id;
			let room2_id = (await repo.findOneBy({ name: unit_room_bis})).id;
			await service.update(room_id, roomPost);
			await service.update(room2_id, roomPost2);
			const room = await service.returnOne(room_id);
			const room2 = await service.returnOne(room2_id);
			expect(room.name).toEqual(roomPost.name);
			expect(room2.name).toEqual(roomPost2.name);
			expect(room2.type).toEqual(roomPost2.type);
		});
	});

	describe("getAllPrivateRoom", () => {
		it("[CHATROOM] should return AllPrivateRoom", async () => {
			let userIds = [];
			const roomId = await service.create({name: "Unit Private Room", type: RoomType.PRIVATE});
			for (let i: number = 0; i < 3; i++ )
			{
				userIds.push(await userService.create({ftLogin: "Unit Private User" + i}));
				await userChatRoomService.create({isOwner: true}, userIds[i], roomId);
			}
			let roomList = await service.getAllPrivateRoom(roomId);
			console.log('room list = ', roomList);
			for (let i: number = 0; i < 3; i++ )
				expect(roomList.roomInfo[i].userId).toEqual(userIds[i]);
			for (let i: number = 0; i < 3; i++ )
				await userService.delete(userIds[i]);
			await service.delete(roomId);
		});
	});

	describe('delete', () => {
		it('should delete a room', async () => {
			const room = await repo.findOneBy({name: unit_room + '_name'}); 
			const id = room.id;
			await service.delete(id);
			await expect(service.returnOne(id)).rejects.toThrowError(
				new ForbiddenException("ChatRoom not found"),
			);
		});
	});
});
