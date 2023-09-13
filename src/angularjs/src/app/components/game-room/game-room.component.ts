import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import * as ex from 'excalibur';
import { GameRoomState, GameRoomStatus } from 'src/app/services/game/schemas/game-room';
import { Paddle } from 'src/app/interfaces/game/actors/paddle';
import { Ball } from 'src/app/interfaces/game/actors/ball';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css'],
})
export class GameRoomComponent implements OnInit {
  meId: number;
  constructor(
    private gameService: GameService,
    private userService: UserService,
  ) {
    this.meId = this.userService.user.id;
  }

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
    const localScore = new ex.Label({
      x: engine.halfDrawWidth / 2,
      y: engine.drawHeight - 100,
      text: '0',
      color: ex.Color.White,
    });
    const remoteScore = new ex.Label({
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
    game.add(localScore);
    game.add(remoteScore);
    game.add(gameStatus);
    engine.add('game', game);
    engine.start().then(() => {
      engine.goToScene('game');
      this.gameService.room.onStateChange((state: GameRoomState) => {
        if (this.meId == state.player1X) {
          localPaddle.pos.x = state.player1X;
          remotePaddle.pos.x = state.player2X;
          localScore.text = state.score1.toString();
          remoteScore.text = state.score2.toString();
        }
        else {
          localPaddle.pos.x = state.player2X;
          remotePaddle.pos.x = state.player1X;
          localScore.text = state.score2.toString();
          remoteScore.text = state.score1.toString();
        }
        ball.pos.x = state.ballX;
        ball.pos.y = state.ballY;
        ball.vx = state.ballVX;
        ball.vy = state.ballVY;
        state.gameStatus === GameRoomStatus["WAITING"] ? gameStatus.text = 'Waiting for players' : gameStatus.text = '';
      });
      this.gameService.room.onMessage("start", (message) => {
        console.log(message);
      });
    });
    
    engine.input.pointers.primary.on('move', (evt) => {
      //paddle1.pos.x = evt.worldPos.x;
      //this.gameService.room?.send('paddle1', paddle1.pos.y);
    });
    
  }
}
