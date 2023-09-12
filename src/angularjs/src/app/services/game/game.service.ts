import { inject, Injectable } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { Schema, type } from '@colyseus/schema';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _client: Colyseus.Client = {} as Colyseus.Client;
  private _room: Colyseus.Room<Schema> | null = null;
  private _state: Schema | null = null;

  public  defaultRoomName: string = "lobby";

  constructor() {
    this._client = new Colyseus.Client(environment.game_socket_url);
  }

  async join(roomName: string) {
    if (this._room) {
      await this.leave();
    }
    this._room = await this._client.joinOrCreate(roomName);
    this._state = this._room.state;
    console.log(this._room.state);
  }

  async leave() {
    if (this._room) {
      console.log("leave called for room: " + this._room.name);
      this._room.leave()
      .then(() => {
        this._room?.removeAllListeners();
        this._room = null;
	      this._state = null;
      })
      .catch((e) => {
        throw new Error(e);
      });
    }
  }

  get state(): Schema | null {
    return this._state;
  }

  get room(): Colyseus.Room<Schema> | null {
    return this._room;
  }

  get client(): Colyseus.Client {
    return this._client;
  }
}
