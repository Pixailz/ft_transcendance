import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserChatRoomEntity } from "./entity";
import { UserChatRoomPost } from "./dto";

import { UserEntity } from "../user/entity";
import { ChatRoomEntity } from "../chatRoom/entity";

@Injectable()
export class UserChatRoomService {
        constructor(
                @InjectRepository(UserChatRoomEntity)
                private readonly userChatRoomRepo: Repository<UserChatRoomEntity>,
                @InjectRepository(ChatRoomEntity)
                private readonly ChatRoomRepo: Repository<ChatRoomEntity>,
                @InjectRepository(UserEntity)
                private readonly userRepo: Repository<UserEntity>,
        ) {}

        async create(post: UserChatRoomPost, userId: number, roomId: number) {

                const userChat = new UserChatRoomEntity();
                // const user = await this.userRepo.findOneBy({ id: userId });
                // const newRoom = await this.ChatRoomRepo.findOneBy({ id: roomId });

                userChat.userId = userId;
                userChat.roomId = roomId;
                userChat.isOwner = post.isOwner;
                userChat.isAdmin = post.isAdmin;
                return await this.userChatRoomRepo.save(userChat);
          }

        async returnAll() {
                return await this.userChatRoomRepo.find();
        }

        async returnOne(user: number, room: number) {
                console.log(user);
                console.log(room);
                return await this.userChatRoomRepo.findOneBy({ userId: user, roomId: room });
        }

        async update(user: number, room: number, post: UserChatRoomPost) {
                console.log(user);
                console.log(room);
                console.log(post);
                const tmp = await this.userChatRoomRepo.findOneBy({ userId: user, roomId: room });
                return await this.userChatRoomRepo.update(tmp, post);
        }

        async delete(user: number, room: number) {
                console.log(user);
                console.log(room);
                const tmp = await this.userChatRoomRepo.findOneBy({ userId: user, roomId: room });
                return await this.userChatRoomRepo.delete(tmp);
        }
}