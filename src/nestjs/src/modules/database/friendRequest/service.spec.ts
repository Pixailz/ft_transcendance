import { DBFriendRequestService } from './service';
import { FriendRequestEntity } from './entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DBModule } from '../database.module';
import { DBUserService } from '../user/service';
import { UserEntity } from '../user/entity';
import { exec } from 'child_process';

 describe('DBFriendRequestService', () => {
  let service: DBFriendRequestService;
  let repo: Repository<FriendRequestEntity>;
  let unit_user: string = "UNIT_USER";
  let userService: DBUserService;
  beforeEach(async () => {
	const module = await Test.createTestingModule({
	  imports: [DBModule],
	  providers: [
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
	repo = module.get<Repository<FriendRequestEntity>>(getRepositoryToken(FriendRequestEntity));
  });
  
  it('should be defined', () => {
	expect(service).toBeDefined();
  });
  
	describe('testing create and returnOne', () => {
		it('[FRIENDRequest REQUEST] should create 2 friendRequest', async () => {
			const test = await service.returnAll();
		    const user_test = await userService.returnAll();
            let len = 0;
            if (user_test.length != 1)
            {
                len = user_test.length;
                unit_user += len - 2; 
            }
            const me = await userService.returnOne(null, unit_user);

			let friendRequest_id = await userService.create({ftLogin: unit_user + "friendRequest_test"});      
			let tmp = await service.create({friendId: friendRequest_id}, me.id); 
			// console.log('in create first room : room id ', room.id, 'room login = ', room.name);
			expect(tmp.friendId).toEqual(friendRequest_id);
			expect(tmp.meId).toEqual(me.id);
			// await userService.delete(friendRequest_id);
		});
	  });
	   
	// describe('update', () => {
	// 	it('[CHATROOM] should update 2 room', async () => {
	// 		const roomPost = { name: unit_user + '_name', type : "random_type"};
	// 		const roomPost2 = { name: unit_user + '_name_BIS', type : "random_type"};
	// 		let room_id = (await repo.findOne({where: {name: unit_user}})).id
	// 		let room2_id = (await repo.findOne({where: {name: unit_user_bis}})).id
	// 		await service.update(room_id, roomPost);
	// 		await service.update(room2_id, roomPost2);
	// 		const room = await service.returnOne(room_id);
	// 		const room2 = await service.returnOne(room2_id);
	// 		expect(room.name).toEqual(roomPost.name);
	// 		expect(room2.name).toEqual(roomPost2.name);
	// 	});
	//   });

	// describe('delete', () => {
	// 	it('should delete a room', async () => {
	// 		const room = await repo.findOneBy({name: unit_user + '_name'}); 
	// 		const id = room.id;
	// 		await service.delete(id);
	// 		await expect(service.returnOne(id)).rejects.toThrowError(
	// 			new ForbiddenException("ChatRoom not found"),
	// 			);
	// 	});
	// });  
});