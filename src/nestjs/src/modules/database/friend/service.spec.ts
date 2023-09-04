import { DBFriendService } from "./service";
import { FriendEntity } from "./entity";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ForbiddenException } from "@nestjs/common";
import { DBModule } from "../database.module";
import { DBUserService } from "../user/service";
import { UserEntity } from "../user/entity";
import { exec } from "child_process";

describe("DBFriendService", () => {
	let service: DBFriendService;
	let repo: Repository<FriendEntity>;
	let unit_user: string = "UNIT_USER";
	let userService: DBUserService;
	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [DBModule],
			providers: [
				DBFriendService,
				{
					provide: getRepositoryToken(FriendEntity),
					useClass: Repository,
				},
				DBUserService,
				{
					provide: getRepositoryToken(UserEntity),
					useClass: Repository,
				},
			],
		}).compile();
		userService = module.get<DBUserService>(DBUserService);
		service = module.get<DBFriendService>(DBFriendService);
		repo = module.get<Repository<FriendEntity>>(
			getRepositoryToken(FriendEntity),
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("testing create and returnOne", () => {
		it("[FRIEND] should create friend relation table", async () => {
			const test = await service.returnAll();
			const user_test = await userService.returnAll();
			let len = 0;
			if (user_test.length != 1) {
				len = user_test.length;
				unit_user += len - 2;
			}

			const me = await userService.returnOne(null, unit_user);
			let friend_id = await userService.create({
				ftLogin: unit_user + "friend_test",
			});
			let tmp = await service.create({ friendId: friend_id }, me.id);
			// console.log('in create first room : room id ', room.id, 'room login = ', room.name);
			expect(tmp.friendId).toEqual(friend_id);
			expect(tmp.meId).toEqual(me.id);
			// test reverse creation
			let tmp2 = await service.returnOne(friend_id, me.id);
			expect(tmp2.meId).toEqual(friend_id);
			expect(tmp2.friendId).toEqual(me.id);
			await userService.delete(friend_id);
		});
	});

	describe("[Friend] delete", () => {
		it("should delete a room", async () => {
			const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({
				ftLogin: unit_user + "friend",
			});
			await service.create({ friendId: friendId }, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await service.delete(meId, friendId);
			await expect(
				service.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("Friend relation not found"),
			);
			await userService.delete(friendId);
		});
	});

	describe("[Friend] delete on cascade", () => {
		it("should delete a room", async () => {
			const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({
				ftLogin: unit_user + "cascade_friend",
			});
			await service.create({ friendId: friendId }, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await userService.delete(friendId);
			await expect(
				service.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("Friend relation not found"),
			);
		});
	});
});
