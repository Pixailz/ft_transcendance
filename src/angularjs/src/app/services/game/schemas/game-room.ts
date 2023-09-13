import { Schema, Context, type } from "@colyseus/schema";

export enum GameRoomStatus {
  WAITING = 0,
  STARTED,
  FINISHED,
  INTERRUPTED,
}

export class GameRoomState extends Schema {
    @type('int8') public ballX = 0;
    @type('int8') public ballY = 0;
    @type('int8') public ballVX = 0;
    @type('int8') public ballVY = 0;

    @type('int8') public player1X = 0;
    @type('int8') public player2X = 0;

    @type('int8') public score1 = 0;
    @type('int8') public score2 = 0;

    @type('int8') public gameStatus = GameRoomStatus['WAITING'];

    constructor() {
        super();
    }
}