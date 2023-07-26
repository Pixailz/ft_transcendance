import { Body, Controller, Post, Put, Get, Delete, Res, Param } from "@nestjs/common";
import { Response } from "express";

import { UserChatRoomService } from "./service";
import { UserChatRoomPost } from "./dto";


@Controller("userChatRoom")
export class UserChatRoomController {
        constructor(private readonly chatRoomService: UserChatRoomService) {}

        @Post(":user_id/:chat_id")
        create(
                @Param("user_id") userId: number,
                @Param("chat_id") chatId: number,
                @Body() post: UserChatRoomPost
        ) {
                return this.chatRoomService.create(post, userId, chatId);
        }

        @Get()
        async getAll(
                @Res() res: Response,
        ) {
                res.send(await this.chatRoomService.returnAll());
        }

        @Get(":user_id/:chat_id")
        async getOne(
                @Param("user_id") userId: number,
                @Param("chat_id") chatId: number,
                @Res() res: Response,
                ) {
                res.send(await this.chatRoomService.returnOne(userId, chatId));
        }

        @Put(":user_id/:chat_id")
        async update(
                @Param("user_id") userId: number,
                @Param("chat_id") chatId: number,
                @Body() userPost: UserChatRoomPost,
                @Res() res: Response,
        ) {
                res.send(await this.chatRoomService.update(userId, chatId, userPost));
        }

        @Delete(":user_id/:chat_id")
        async delete(
                @Param("user_id") userId: number,
                @Param("chat_id") chatId: number,
                @Res() res: Response,
        ) {
                res.send(await this.chatRoomService.delete(userId, chatId));
        }
}