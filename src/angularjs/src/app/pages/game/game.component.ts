import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { GameRoomState } from 'src/app/services/game/schemas/game-room';
import { Schema } from '@colyseus/schema';
import { Room } from 'colyseus.js';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  roomName: string | null = '';
  roomState: Schema | null = null;
  constructor(private gameService: GameService) {}

  async ngOnInit() {
    await this.gameService.join('lobby');
    if (this.gameService.room) {
      this.roomState = this.gameService.state;
      this.roomName = this.gameService.room.name;
      this.gameService.room.onLeave((code) => {
        console.log('left room: ' + code);
        this.roomState = null;
        this.roomName = null;
      });
    }
  }

  joinLobby() {
    this.gameService
      .join(this.gameService.defaultRoomName)
      .then(() => {
        this.roomState = this.gameService.state;
        this.roomName = this.gameService.room?.name || '';
        this.setupCallbacks(this.gameService.room as Room);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  setupCallbacks(
    room: Room,
    onerror?: (code: number, message: string | undefined) => void,
    onstatechange?: (state: Schema) => void,
    onmessage?: (message: string | number | undefined) => void,
    onleave?: (code: number) => void
  ): void {
    if (room) {
      if (onerror) room.onError(onerror);
      else {
        room.onError((code, message) => {
          throw new Error(`${code} - ${message}`);
        });
      }
      if (onstatechange) room.onStateChange(onstatechange);
      else {
        room.onStateChange((state) => {
          this.roomState = state;
        });
      }
      if (onmessage) room.onMessage('*', onmessage);
      else {
        room.onMessage('*', (message) => {});
      }
      if (onleave) room.onLeave(onleave);
      else {
        room.onLeave((code) => {
          console.log('left room: ' + code);
          this.roomState = null;
          this.roomName = null;
        });
      }
    }
  }
}
