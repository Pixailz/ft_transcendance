import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  roomName: string = "lobby";
  roomState: any = null;
  constructor(
    private gameService: GameService
  ) { }

  async ngOnInit() {
    this.gameService.join(this.roomName);

  }

}
