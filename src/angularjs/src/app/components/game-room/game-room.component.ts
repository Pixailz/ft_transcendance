import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css'],
})
export class GameRoomComponent implements OnInit {
  constructor(
    private gameService: GameService,
  ) {}

  ngOnInit() {
    this.gameService.room?.onMessage("start", (message) => {
      console.log(message);
    });
  }
}
