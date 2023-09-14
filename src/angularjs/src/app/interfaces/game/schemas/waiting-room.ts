import { Schema, Context, type } from "@colyseus/schema";

export enum WaitingRoomStatus {
  WAITING = 0,
  STARTED,
  FINISHED,
  INTERRUPTED,
}

export class WaitingRoomState extends Schema {
  @type('int8')
  public gameStatus = WaitingRoomStatus['WAITING'];
}