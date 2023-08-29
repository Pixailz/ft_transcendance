import { DBMutedService } from './service';
import { MutedEntity } from './entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { DBModule } from '../database.module';
import { DBUserService } from '../user/service';
import { UserEntity } from '../user/entity';
import { exec } from 'child_process';

 describe('DBMutedService', () => {
  let service: DBMutedService;
  let unit_user: string = "UNIT_USER";
  let userService: DBUserService;
  beforeEach(async () => {
	const module = await Test.createTestingModule({
	  imports: [DBModule],
	  providers: [
		DBMutedService,
		{
		  provide: getRepositoryToken(MutedEntity),
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
	service = module.get<DBMutedService>(DBMutedService);
  });
  
  it('should be defined', () => {
	expect(service).toBeDefined();
  });
  
	describe('testing create and returnOne', () => {
		it('[Muted] should create 2 Muted', async () => {
			const test = await service.returnAll();
		    const user_test = await userService.returnAll();
            let len = 0;
            if (user_test.length != 1)
            {
                len = user_test.length;
                unit_user += len - 2; 
            }
            const me = await userService.returnOne(null, unit_user);

			let mutedId = await userService.create({ftLogin: unit_user + "Muted_test"});      
			let tmp = await service.create({mutedId: mutedId}, me.id); 
			// console.log('in create first room : room id ', room.id, 'room login = ', room.name);
			expect(tmp.mutedId).toEqual(mutedId);
			expect(tmp.meId).toEqual(me.id);
			await userService.delete(mutedId);
		});
	  });
	   
	describe('[Muted] delete', () => {
		it('should delete a room', async () => {
            const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const mutedId = await userService.create({ftLogin: unit_user + "muted"});
			await service.create({mutedId: mutedId}, meId);
			const tmp = await service.returnOne(meId, mutedId);
			expect(tmp.meId).toEqual(meId);
			await service.delete(meId, mutedId);
			await expect(service.returnOne(meId, mutedId)).rejects.toThrowError(
				new ForbiddenException("Muted relation not found"),
				);
			await userService.delete(mutedId);
		});
	}); 

	describe('[Muted] delete on cascade', () => {
		it('should delete a room', async () => {
            const me = await userService.returnOne(null, unit_user);
			const meId = me.id;
			const mutedId = await userService.create({ftLogin: unit_user + "cascade_muted"});
			await service.create({mutedId: mutedId}, meId);
			const tmp = await service.returnOne(meId, mutedId);
			expect(tmp.meId).toEqual(meId);
			await userService.delete(mutedId);
			await expect(service.returnOne(meId, mutedId)).rejects.toThrowError(
				new ForbiddenException("Muted relation not found"),
				);
		});
	});  
});