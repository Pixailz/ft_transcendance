import { DBFriendRequestService } from './service';
import { FriendRequestEntity } from './entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DBModule } from '../database.module';
import { DBUserService } from '../user/service';
import { UserEntity } from '../user/entity';

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
			expect(tmp.friendId).toEqual(friendRequest_id);
			expect(tmp.meId).toEqual(me.id);
			await userService.delete(friendRequest_id);
		});
	  });
	describe('[FriendRequest] delete', () => {
		it('should delete a room', async () => {
            const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({ftLogin: unit_user + "friend_req"});
			await service.create({friendId: friendId}, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await service.delete(meId, friendId);
			await expect(service.returnOne(meId, friendId)).rejects.toThrowError(
				new ForbiddenException("FriendRequest relation not found"),
				);
			await userService.delete(friendId);
		});
	}); 

	describe('[FriendRequest] delete on cascade', () => {
		it('should delete a room', async () => {
            const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const friendId = await userService.create({ftLogin: unit_user + "cascade_friend_req"});
			await service.create({friendId: friendId}, meId);
			const tmp = await service.returnOne(meId, friendId);
			expect(tmp.meId).toEqual(meId);
			await userService.delete(friendId);
			await expect(service.returnOne(meId, friendId)).rejects.toThrowError(
				new ForbiddenException("FriendRequest relation not found"),
				);
		});
	});
});