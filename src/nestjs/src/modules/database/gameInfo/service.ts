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

                const gameInfo = new GameInfoEntity();
                // const user = await this.userRepo.findOneBy({ id: userId });
                // const newRoom = await this.ChatRoomRepo.findOneBy({ id: roomId });
                gameInfo.type = post.type;
                gameInfo.userA = userA;
                gameInfo.userB = userB;
                return await this.gameInfoRepo.save(gameInfo);
          }

        async returnAll() {
                return await this.gameInfoRepo.find();
        }

        async returnOne(gameId: number) {
                return await this.gameInfoRepo.findOneBy({ id: gameId });
        }

        async update(gameId: number, post: GameInfoPost) {
                return await this.gameInfoRepo.update(gameId, post);
        }

        // async delete(user: number, room: number) {
        //         console.log(user);
        //         console.log(room);
        //         const tmp = await this.gameInfoRepo.findOneBy({ userId: user, roomId: room });
        //         return await this.gameInfoRepo.delete(tmp);
        // }
}