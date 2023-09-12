import { Component, OnInit, Output } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {
  @Output() public joinRoom: string = "";
  
  constructor(
    private gameService: GameService
  ) { }

  ngOnInit() {
    console.log(this.gameService.room?.name);
  }

  onAction1() {
    this.gameService.join("game");
  }

  onAction2() {
    this.gameService.leave();
  }

  onAction3() {
    console.log("Action 3");
  }

}
