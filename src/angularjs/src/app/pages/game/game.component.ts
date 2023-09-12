import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  roomName: string | null = "";
  roomState: any = null;
  constructor(
    private gameService: GameService
  ) { }

  async ngOnInit() {
    await this.gameService.join("lobby");
    if (this.gameService.room) {
      this.roomState = this.gameService.state;
      this.roomName = this.gameService.room.name;
    }
    console.log(this.gameService.room)
  }

}
