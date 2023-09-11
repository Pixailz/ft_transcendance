import { inject, Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { Schema, type } from '@colyseus/schema';
import { environment } from '../environments/environment';


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

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private client: Colyseus.Client;
  private room?: Colyseus.Room<GameState>;
constructor() {
  this.client = new Colyseus.Client(environment.game_socket_url);
  this.client.joinOrCreate("waiting_room", {}, GameState).then(room => {
    this.room = room;
    console.log("joined successfully", room);
  })
  .catch(e => {
    console.log("join error", e);
  });
}

}
