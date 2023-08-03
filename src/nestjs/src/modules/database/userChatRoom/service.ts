import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

        async create(post: UserChatRoomPost, UserId: number, RoomId: number) {
                const userChat = new UserChatRoomEntity();
                let user = await this.userRepo.findOneBy({id: UserId});
                if (user)
                        userChat.userId = UserId;
                else
                        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                let room = await this.ChatRoomRepo.findOneBy({id: RoomId});
                if (room)
                        userChat.roomId = RoomId;
                else
                        throw new HttpException('ChatRoom not found', HttpStatus.NOT_FOUND);
                userChat.isOwner = post.isOwner;
                userChat.isAdmin = post.isAdmin;
                return await this.userChatRoomRepo.save(userChat);
          }

        async returnAll() {
                return await this.userChatRoomRepo.find();
        }

        async returnOne(user: number, room: number) {
                const tmp = await this.userChatRoomRepo.findOneBy({ userId: user, roomId: room });
                if (tmp)
                        return tmp;
                else
                        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        async update(user: number, room: number, post: UserChatRoomPost) {
                const tmp = await this.userChatRoomRepo.findOneBy({ userId: user, roomId: room });
                if (tmp)
                        return await this.userChatRoomRepo.update(tmp, post);
                else
                        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        async delete(user: number, room: number) {
                const tmp = await this.userChatRoomRepo.findOneBy({ userId: user, roomId: room });
                if (tmp)
                        return await this.userChatRoomRepo.delete(tmp);
                else
                        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
}