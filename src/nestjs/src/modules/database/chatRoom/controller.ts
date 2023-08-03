import { Body, Controller, Post, Put, Get, Delete, Res, Param } from "@nestjs/common";
import { Response } from "express";

import { ChatRoomService } from "./service";
import { ChatRoomPost } from "./dto";

@Controller("chatRoom")
export class ChatRoomController {
        constructor(private readonly chatRoomService: ChatRoomService) {}

        @Post()
        create(@Body() post: ChatRoomPost) {
                return this.chatRoomService.create(post);
        }

        @Get()
        async getAll(
                @Res() res: Response,
        ) {
                res.send(await this.chatRoomService.returnAll());
        }

        @Get(":id")
        async getOne(
                @Param("id") userId: number,
                @Res() res: Response,
                ) {
                res.send(await this.chatRoomService.returnOne(userId));
        }

        @Put(":id")
        async update(
                @Param("id") userId: number,
                @Body() userPost: ChatRoomPost,
                @Res() res: Response,
        ) {
                res.send(await this.chatRoomService.update(userId, userPost));
        }

        @Delete(":id")
        async delete(
                @Param("id") userId: number,
                @Res() res: Response,
        ) {
                res.send(await this.chatRoomService.delete(userId));
        }
}