import { Body, Controller, Post, Put, Get, Delete, Res, Param } from "@nestjs/common";
import { Response } from "express";

import { GameInfoService } from "./service";
import { GameInfoPost } from "./dto";


@Controller("gameInfo")
export class GameInfoController {
        constructor(private readonly gameInfoService: GameInfoService) {}

        @Post(":userA/:userB")
        create(
                @Param("userA") userAA: number,
                @Param("userB") userBB: number,
                @Body() post: GameInfoPost
        ) {
                return this.gameInfoService.create(post, userAA, userBB);
        }

        @Get()
        async getAll(
                @Res() res: Response,
        ) {
                res.send(await this.gameInfoService.returnAll());
        }

        @Get(":id")
        async getOne(
                @Param("id") gameId: number,
                @Res() res: Response,
                ) {
                res.send(await this.gameInfoService.returnOne(gameId));
        }

        @Put(":id")
        async update(
                @Param("id") gameId: number,
                @Body() userPost: GameInfoPost,
                @Res() res: Response,
        ) {
                res.send(await this.gameInfoService.update(gameId, userPost));
        }

        @Delete(":id")
        async delete(
                @Param("id") userId: number,
                @Res() res: Response,
        ) {
                res.send(await this.gameInfoService.delete(userId));
        }
}