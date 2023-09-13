import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import * as ex from 'excalibur';
import { GameRoomState } from 'src/app/services/game/schemas/game-room';
import { Paddle } from 'src/app/interfaces/game/actors/paddle';
import { Ball } from 'src/app/interfaces/game/actors/ball';

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
    const engine = new ex.Engine({
      canvasElementId: 'pong',
    });
    const localPaddle = new Paddle(engine.drawWidth / 2, engine.drawHeight - 50, 200, 20, ex.Color.Red, ex.Keys.A, ex.Keys.D);
    const remotePaddle = new Paddle(engine.drawWidth / 2, 50, 200, 20, ex.Color.Green, ex.Keys.Left, ex.Keys.Right);
    const ball = new Ball(engine.drawWidth / 2, engine.drawHeight / 2, 5, 0, 20, 20, ex.Color.Red);
    const score1 = new ex.Label({
      x: engine.halfDrawWidth / 2,
      y: engine.drawHeight - 100,
      text: '0',
      color: ex.Color.White,
    });
    const score2 = new ex.Label({
      x: engine.halfDrawWidth * 1.5,
      y: engine.drawHeight - 100,
      text: '0',
      color: ex.Color.White,
    });
    const gameStatus = new ex.Label({
      x: engine.halfDrawWidth - 50,
      y: engine.halfDrawHeight,
      text: 'Waiting for players',
      color: ex.Color.White,
    });
    const game = new ex.Scene();
    game.add(localPaddle);
    game.add(remotePaddle);
    game.add(ball);
    game.add(score1);
    game.add(score2);
    game.add(gameStatus);
    engine.add('game', game);
    engine.start().then(() => {
      engine.goToScene('game');
      while (this.gameService.room.state.gameStatus === GameRoomState['WAITING']) {
        gameStatus.text = 'Waiting for players';
      }
      gameStatus.text = '';
    });
    
    engine.input.pointers.primary.on('move', (evt) => {
      //paddle1.pos.x = evt.worldPos.x;
      //this.gameService.room?.send('paddle1', paddle1.pos.y);
    });
    
    game.onPreUpdate = (evt) => {
      if (ball.pos.y < 0) {
        this.gameService.room?.send('lostBall');
      }
      if (ball.pos.y > engine.drawHeight) {
        this.gameService.room?.send('wonBall');
      }
    }
  }
}
