import { DBFriendRequestService } from "./service";
import { FriendRequestEntity } from "./entity";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ForbiddenException } from "@nestjs/common";
import { DBModule } from "../database.module";
import { DBUserService } from "../user/service";
import { DBFriendService } from "../friend/service";
import { UserEntity } from "../user/entity";
import { Sanitize } from "../../../sanitize-object";

describe("DBFriendRequestService", () => {
	let service: DBFriendRequestService;
	let unit_user: string = "UNIT_USER";
	let userService: DBUserService;
	let friendService: DBFriendService;
	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [DBModule],
			providers: [
				Sanitize,
				DBFriendRequestService,
				{
					provide: getRepositoryToken(FriendRequestEntity),
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
		service = module.get<DBFriendRequestService>(DBFriendRequestService);
		friendService = module.get<DBFriendService>(DBFriendService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("testing create and returnOne", () => {
		it("[FiendRequest] should create 2 friendRequest", async () => {
			const test = await service.returnAll();
			const user_test = await userService.returnAll();
			let len = 0;
			if (user_test.length != 1) {
				len = user_test.length;
				unit_user += len - 2;
			}
			const me = await userService.returnOne(null, unit_user);

			let friendRequest_id = await userService.create({
				ftLogin: unit_user + "friendRequest_test",
			});
			let tmp = await service.create(
				{ friendId: friendRequest_id },
				me.id,
			);
			expect(tmp.friendId).toEqual(friendRequest_id);
			expect(tmp.meId).toEqual(me.id);
			await userService.delete(friendRequest_id);
			await expect(
				service.create({ friendId: -1 }, me.id),
			).rejects.toThrowError(new ForbiddenException("User not found"));
		});
	});

	describe("[FriendRequest] delete", () => {
		it("should delete a room", async () => {
			const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({
				ftLogin: unit_user + "friend_req",
			});
			await service.create({ friendId: friendId }, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await service.delete(meId, friendId);
			await expect(
				service.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("FriendRequest relation not found"),
			);
			await userService.delete(friendId);
		});
	});

	describe("[FriendRequest] accept request", () => {
		it("should delete a room", async () => {
			const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({
				ftLogin: unit_user + "friend_request",
			});
			await service.create({ friendId: friendId }, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await service.acceptReq(meId, friendId);
			await expect(
				service.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("FriendRequest relation not found"),
			);
			expect(
				(await friendService.returnOne(meId, friendId)).meId,
			).toEqual(meId);
			expect(
				(await friendService.returnOne(friendId, meId)).meId,
			).toEqual(friendId);
			await userService.delete(friendId);
		});
	});

	describe("[FriendRequest] Reject request", () => {
		it("should delete a room", async () => {
			const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({
				ftLogin: unit_user + "friend_request",
			});
			await service.create({ friendId: friendId }, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await service.rejectReq(meId, friendId);
			await expect(
				service.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("FriendRequest relation not found"),
			);
			await expect(
				friendService.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("Friend relation not found"),
			);
			await expect(
				friendService.returnOne(friendId, meId),
			).rejects.toThrowError(
				new ForbiddenException("Friend relation not found"),
			);
			await userService.delete(friendId);
		});
	});

	describe("[FriendRequest] delete on cascade", () => {
		it("should delete a room", async () => {
			const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({
				ftLogin: unit_user + "cascade_friend_req",
			});
			await service.create({ friendId: friendId }, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await userService.delete(friendId);
			await expect(
				service.returnOne(meId, friendId),
			).rejects.toThrowError(
				new ForbiddenException("FriendRequest relation not found"),
			);
		});
	});
});
