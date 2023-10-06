import { DBUserService } from "./service";
import { UserEntity } from "./entity";
import { Repository } from "typeorm";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BadRequestException } from "@nestjs/common";
import { DBModule } from "../database.module";
import { DBUserPost } from "./dto";
import { Sanitize } from "../sanitize-object";

describe("DBUserService", () => {
	let service: DBUserService;
	let repo: Repository<UserEntity>;

	let unit_user: string = "UNIT_USER";
	let unit_user_bis = unit_user + "_BIS";

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [DBModule],
			providers: [
				Sanitize,
				DBUserService,
				{
					provide: getRepositoryToken(UserEntity),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<DBUserService>(DBUserService);
		repo = module.get<Repository<UserEntity>>(
			getRepositoryToken(UserEntity),
		);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("testing create and returnOne", () => {
		it("[USER] should create 2 user and 1 error (empty ftLogin)", async () => {
			const test = await service.returnAll();
			if (test.length != 0) {
				const len = test.length;
				unit_user += len - 1;
				unit_user_bis = unit_user + "_BIS";
			}
			const userPost = { ftLogin: unit_user };
			const userPost2 = { ftLogin: unit_user_bis };
			const userPost3 = new DBUserPost();
			userPost3.ftLogin = "";

			let userId = await service.create(userPost);
			let user = await service.returnOne(userId, null);

			expect(user.nickname).toEqual("");
			expect(userId).toEqual(user.id);

			let userId2 = await service.create(userPost2);
			let user2 = await service.returnOne(userId2, null);

			expect(userId2).toEqual(user2.id);

			await expect(service.create(userPost3)).rejects.toThrowError(
				new BadRequestException("User Login can't be blank or empty"),
			);

			// await expect(service.create(userPost3)).rejects.toThrowError(
			// 	new BadRequestException("minimum len for login is 4"),
			// );
		});
	});

	describe("update", () => {
		it("[USER] should update 2 user", async () => {
			const userPost = {
				nickname: unit_user + "_name",
				email: unit_user + "@mail.com",
			};
			const userPost2 = {
				nickname: unit_user + "name_BIS",
				email: unit_user + "_BIS@mail.com",
			};
			let user_id = (await service.returnOne(null, unit_user)).id;
			let user2_id = (await service.returnOne(null, unit_user_bis)).id;
			await service.update(user_id, userPost);
			await service.update(user2_id, userPost2);
			const user = await service.returnOne(user_id, null);
			const user2 = await service.returnOne(user2_id, null);
			expect(user.nickname).toEqual(userPost.nickname);
			expect(user2.email).toEqual(userPost2.email);
		});
	});

	describe("delete", () => {
		it("should delete a user", async () => {
			const user = await service.returnOne(null, unit_user_bis);
			// console.log('user in delete = ', user);
			const id = user.id;
			await service.delete(user.id);
			const ret = await service.returnOne(id, null);
			expect(ret).toBeNull();
		});
	});
});
