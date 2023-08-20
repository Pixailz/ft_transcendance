import { DBFriendService } from './service';
import { FriendEntity } from './entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DBModule } from '../database.module';
import { DBUserService } from '../user/service';
import { UserEntity } from '../user/entity';
import { exec } from 'child_process';

 describe('DBFriendService', () => {
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
	repo = module.get<Repository<FriendEntity>>(getRepositoryToken(FriendEntity));
  });
  
  it('should be defined', () => {
	expect(service).toBeDefined();
  });
  
	describe('testing create and returnOne', () => {
		it('[FRIEND] should create 2 friend', async () => {
			const test = await service.returnAll();
		    const user_test = await userService.returnAll();
            let len = 0;
            if (user_test.length != 1)
            {
                len = user_test.length;
                unit_user += len - 2; 
            }
            const me = await userService.returnOne(null, unit_user);

			let friend_id = await userService.create({ftLogin: unit_user + "friend_test"});      
			let tmp = await service.create({friendId: friend_id}, me.id); 
			// console.log('in create first room : room id ', room.id, 'room login = ', room.name);
			expect(tmp.friendId).toEqual(friend_id);
			expect(tmp.meId).toEqual(me.id);
			await userService.delete(friend_id);
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