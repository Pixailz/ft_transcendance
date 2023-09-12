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
  private _roomName: string | null = null;

  constructor() {
    this._client = new Colyseus.Client(environment.game_socket_url);
  }

  async join(roomName: string) {
    if (this._room) {
      await this.leave();
    }
    this._room = await this._client.joinOrCreate(roomName);
    this.setupCallbacks();
  }

  async leave() {
    if (this._room) {
      await this._room.leave();
      this._room.removeAllListeners();
      this._room = null;
	  this._state = null;
	  this._roomName = null;
    }
  }

  private setupCallbacks(
    onerror?: (code: number, message: string | undefined) => void,
    onstatechange?: (state: Schema) => void,
    onmessage?: (message: string | number | undefined) => void
  ): void {
    if (this._room) {
      if (onerror) this._room.onError(onerror);
      else {
        this._room.onError((code, message) => {
          throw new Error(`${code} - ${message}`);
        });
      }
      if (onstatechange) this._room.onStateChange(onstatechange);
      else {
        this._room.onStateChange((state) => {
          this._state = state;
        });
      }
      if (onmessage) this._room.onMessage('*', onmessage);
      else {
        this._room.onMessage('*', (message) => {
          console.log(message);
        });
      }
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

  get roomName(): string | null {
	return this._roomName;
  }
}
