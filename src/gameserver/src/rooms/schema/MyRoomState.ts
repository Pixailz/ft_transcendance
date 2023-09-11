import { Schema, Context, type } from "@colyseus/schema";

export enum GameStatus {
  WAITING = 0,
  STARTED,
  FINISHED,
  INTERRUPTED,
}

export class GameState extends Schema {
  @type('int8')
  public gameStatus = GameStatus['WAITING'];
}

