import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ChatRoomEntity } from "./entity";
import { ChatRoomPost } from "./dto";

@Injectable()
export class ChatRoomService {
        constructor(
                @InjectRepository(ChatRoomEntity)
                private readonly chatRoomRepo: Repository<ChatRoomEntity>,
        ) {}

        async create(post: ChatRoomPost) {
                const user = new ChatRoomEntity();
                user.name = post.name;
                user.type = post.type;
                user.password = post.password;
                return await this.chatRoomRepo.save(user);
          }

        async returnAll() {
                return await this.chatRoomRepo.find();
        }

        async returnOne(chatId: number) {
                const tmp = await this.chatRoomRepo.findOneBy({id: chatId});
                if (tmp)
                        return await this.chatRoomRepo.findOneBy({ id: chatId });
                else
                        throw new HttpException('ChatRoom not found', HttpStatus.NOT_FOUND);
        }

        async update(chatId: number, post: ChatRoomPost) {
                const tmp = await this.chatRoomRepo.findOneBy({id: chatId});
                if (tmp)
                        return await this.chatRoomRepo.update(chatId, post);
                else
                        throw new HttpException('ChatRoom not found', HttpStatus.NOT_FOUND);
        }

        async delete(chatId: number) {
                const tmp = await this.chatRoomRepo.findOneBy({id: chatId});
                if (tmp)
                        return await this.chatRoomRepo.delete(chatId);
                else
                        throw new HttpException('ChatRoom not found', HttpStatus.NOT_FOUND);
        }
}