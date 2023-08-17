import { DBUserChatRoomService } from './service';
import { UserChatRoomEntity } from './entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DBModule } from '../database.module';

import { ChatRoomEntity } from '../chatRoom/entity';
import { UserEntity } from '../user/entity';
import { DBUserService } from '../user/service';
import { DBChatRoomService } from '../chatRoom/service';

describe('DBUserChatRoomService', () => {
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
    repo = module.get<Repository<UserChatRoomEntity>>(getRepositoryToken(UserChatRoomEntity));
    userService = module.get<DBUserService>(DBUserService);
    chatRoomRepo = module.get<Repository<ChatRoomEntity>>(getRepositoryToken(ChatRoomEntity));
    chatRoomService = module.get<DBChatRoomService>(DBChatRoomService);
});
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('testing create and returnOne', () => {
    it('[USER CHAT ROOM] TEST', async () => {
        const user_test = await userService.returnAll();
        if (user_test.length != 0)
        {
          const len = user_test.length;
          unit_user += len - 2; 
        }
        const room_test = await chatRoomService.returnAll();
        if (room_test.length != 0)
        {
          const len = room_test.length;
          unit_room += len - 2; 
        }
        let user = await userService.returnOne(null, unit_user);  
        console.log('in userchatroom user = ', user);
        let room = await chatRoomRepo.findOneBy({name: unit_room + "_name"})
        console.log('and room = ', room);
        console.log('user name = ', unit_user, ' room name = ', unit_room);
        
        const post = {"isOwner": true, "isAdmin": true};
        const tmp = await service.create(post, user.id, room.id);
        console.log('tmp = ', tmp);
        expect(tmp).toEqual(post);

        // "/shared/transcendence/src/modules/database/userChatRoom/service.spec.ts",


        // await expect(service.create(userPost3)).rejects.toThrowError(
        //   new ForbiddenException("User Login can't be blank or empty"),
        //   );
        });
      });
    });
    //   describe('update', () => {
    //     it('[USER] should update 2 user', async () => {
    //       const userPost = { nickname: unit_user + '_name', email: unit_user + "@mail.com" };
    //       const userPost2 = { nickname: unit_user + 'name_BIS', email: unit_user + "_BIS@mail.com" };
    //       let user_id = (await service.returnOne(null, unit_user)).id;
    //       let user2_id = (await service.returnOne(null, unit_user_bis)).id;
    //       await service.update(user_id, userPost);
    //       await service.update(user2_id, userPost2);
    //       const user = await service.returnOne(user_id, null);
    //       const user2 = await service.returnOne(user2_id, null);
    //       expect(user.nickname).toEqual(userPost.nickname);
    //       expect(user2.nickname).toEqual(userPost2.nickname);
    //     });
    //   });

    //   describe('delete', () => {
    //     it('should delete a user', async () => {
    //       const user = await service.returnOne(null, unit_user_bis);
    //       console.log('user in delete = ', user);
    //       const id = user.id;
    //       await service.delete(user.id);
    //       const ret = await service.returnOne(id, null);
    //       expect(ret).toBeNull();
    //     });
    //   });  

    // });