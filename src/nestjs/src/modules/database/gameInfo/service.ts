import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GameInfoEntity } from "./entity";
import { GameInfoPost } from "./dto";

import { UserEntity } from "../user/entity";

@Injectable()
export class GameInfoService {
        constructor(
                @InjectRepository(GameInfoEntity)
                private readonly gameInfoRepo: Repository<GameInfoEntity>,
                @InjectRepository(UserEntity)
                private readonly userRepo: Repository<UserEntity>,
        ) {}

        async create(post: GameInfoPost, userA: number, userB: number) {

                const userChat = new GameInfoEntity();
                // const user = await this.userRepo.findOneBy({ id: userId });
                // const newRoom = await this.ChatRoomRepo.findOneBy({ id: roomId });

                userChat.userA = userA;
                userChat.userB = userB;
                return await this.gameInfoRepo.save(userChat);
          }

        async returnAll() {
                return await this.gameInfoRepo.find();
        }

        // async returnOne(user: number, room: number) {
        //         console.log(user);
        //         console.log(room);
        //         return await this.gameInfoRepo.findOneBy({ userId: user, roomId: room });
        // }

        // async update(user: number, room: number, post: GameInfoPost) {
        //         console.log(user);
        //         console.log(room);
        //         console.log(post);
        //         const tmp = await this.gameInfoRepo.findOneBy({ userId: user, roomId: room });
        //         return await this.gameInfoRepo.update(tmp, post);
        // }

        // async delete(user: number, room: number) {
        //         console.log(user);
        //         console.log(room);
        //         const tmp = await this.gameInfoRepo.findOneBy({ userId: user, roomId: room });
        //         return await this.gameInfoRepo.delete(tmp);
        // }
}