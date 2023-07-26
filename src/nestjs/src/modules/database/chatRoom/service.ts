import { Injectable } from "@nestjs/common";
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
                console.log(chatId);
                return await this.chatRoomRepo.findOneBy({ id: chatId });
        }

        async update(chatId: number, post: ChatRoomPost) {
                console.log(chatId);
                console.log(post);
                return await this.chatRoomRepo.update(chatId, post);
        }

        async delete(chatId: number) {
                console.log(chatId);
                return await this.chatRoomRepo.delete(chatId);
        }
}