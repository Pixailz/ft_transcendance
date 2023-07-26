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

        // @Get(":userA/:userB")
        // async getOne(
        //         @Param("userA") userAA: number,
        //         @Param("userB") userBB: number,
        //         @Res() res: Response,
        //         ) {
        //         res.send(await this.gameInfoService.returnOne(userAA, userBB));
        // }

        // @Put(":userA/:userB")
        // async update(
        //         @Param("userA") userAA: number,
        //         @Param("userB") userBB: number,
        //         @Body() userPost: GameInfoPost,
        //         @Res() res: Response,
        // ) {
        //         res.send(await this.gameInfoService.update(userAA, userBB, userPost));
        // }

        // @Delete(":userA/:userB")
        // async delete(
        //         @Param("userA") userAA: number,
        //         @Param("userB") userBB: number,
        //         @Res() res: Response,
        // ) {
        //         res.send(await this.gameInfoService.delete(userAA, userBB));
        // }
}