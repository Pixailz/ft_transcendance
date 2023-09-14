import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import * as ex from 'excalibur';
import {
  GameRoomState,
  GameRoomStatus,
} from 'src/app/interfaces/game/schemas/game-room';
import { Paddle } from 'src/app/interfaces/game/actors/paddle';
import { Ball } from 'src/app/interfaces/game/actors/ball';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css'],
})
export class GameRoomComponent implements OnInit {
  private meId: string;
  private mySide: 'top' | 'bottom';
  private engine: ex.Engine;
  private game: ex.Scene;
  private localPaddle: Paddle;
  private remotePaddle: Paddle;
  private ball: Ball;
  private localScore: ex.Label;
  private remoteScore: ex.Label;
  private gameStatus: ex.Label;
  private readonly paddleWidth = 75;
  private readonly paddleHeight = 20;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.initGameEngine();
    this.initGameObjects();
    this.listenGameEvents();
  }

  private initGameEngine(): void {
    this.engine = new ex.Engine({ canvasElementId: 'pong', width: 800, height: 600 });
    this.game = new ex.Scene();
    this.engine.add('game', this.game);
    this.engine.fixedUpdateFps = 60;
  }

  private initGameObjects(): void {
    this.localPaddle = this.createPaddle(0, ex.Color.Red, ex.Keys.A, ex.Keys.D);
    this.remotePaddle = this.createPaddle(0, ex.Color.Green);
    this.localScore = this.createScore(this.engine.halfDrawWidth / 2);
    this.remoteScore = this.createScore(this.engine.halfDrawWidth * 1.5);
    this.gameStatus = this.createGameStatus();
    this.ball = this.createBall();
    this.game.add(this.localPaddle);
    this.game.add(this.remotePaddle);
    this.game.add(this.localScore);
    this.game.add(this.remoteScore);
    this.game.add(this.gameStatus);
    this.game.add(this.ball);
  }

  private listenGameEvents(): void {
    this.meId = this.gameService.room.sessionId;
    console.log('meId: ' + this.meId);
    this.gameService.room.state.players.forEach((player) => {
      if (player.id === this.meId) {
        this.mySide = player.side;
      }
    })
    console.log('mySide: ' + this.mySide);
    this.engine.start().then(() => {
      this.engine.goToScene('game');

      this.gameService.room.onStateChange((state: GameRoomState) => {
        this.handleStateChange(state);
      });

      this.gameService.room.onMessage('start', (message) => {
        this.handleBallStart(message);
      });

      this.gameService.room.onMessage('game_win', (message) => {
        this.gameStatus.text = 'Player ' + message + ' wins!';
      });

      this.engine.input.keyboard.on('hold', (evt) => {
        this.handleInputHold(evt);
      });
    });
  }

  private createPaddle(y: number, color: ex.Color, leftKey?: ex.Input.Keys, rightKey?: ex.Input.Keys): Paddle {
    return new Paddle(this.engine.drawWidth / 2, y, this.paddleWidth, this.paddleHeight, color, leftKey, rightKey);
  }

  private calculatePaddlePosY(isLocal: boolean): number {
    if (this.mySide === 'bottom' && isLocal) {
      console.log('bottom && local (red), returned this.paddleHeight * 2');
      return this.paddleHeight * 2;
    } else if (this.mySide === 'bottom' && !isLocal) {
      console.log('bottom && remote (green), returned this.engine.drawHeight - this.paddleHeight * 2');
      return this.engine.drawHeight - this.paddleHeight * 2;
    } else if (this.mySide === 'top' && isLocal) {
      console.log('top && local (red), returned this.engine.drawHeight - this.paddleHeight * 2');
      return this.engine.drawHeight - this.paddleHeight * 2;
    }
    console.log('top && remote (green), returned this.paddleHeight * 2');
    return this.paddleHeight * 2;
  }

  private createBall(): Ball {
    const ball = new Ball(this.engine.drawWidth / 2, this.engine.drawHeight / 2, 20, 20, ex.Color.Red);
    return ball;
  }

  private createScore(x: number): ex.Label {
    return new ex.Label({ x: x, y: this.engine.drawHeight - 100, text: '0', color: ex.Color.White });
  }

  private createGameStatus(): ex.Label {
    return new ex.Label({
      x: this.engine.halfDrawWidth - 50,
      y: this.engine.halfDrawHeight,
      text: 'Waiting for players',
      color: ex.Color.White
    });
  }

  private handleStateChange(state: GameRoomState): void {
    state.players.forEach((player) => {
      if (player.id === this.meId) {
        console.log(player);
        this.localPaddle.pos.x = player.paddle.x;
        this.localPaddle.pos.y = player.paddle.y;
        this.localScore.text = String(player.score);
        this.mySide = player.side;
      } else {
        this.remotePaddle.pos.x = player.paddle.x;
        this.remotePaddle.pos.y = player.paddle.y;
        this.remoteScore.text = String(player.score);
      }
    });
    this.ball.pos.x = state.ball.x;
    this.ball.pos.y = state.ball.y;
    this.ball.update(this.engine, 0);
  }

  private handleBallStart(message): void {
    const counter = new ex.Timer({
      interval: 1000,
      repeats: true,
      numberOfRepeats: Number(message),
      fcn: () => {
        this.gameStatus.text =
          'Starts in : ' +
          String(Number(message) - 1 - counter.timesRepeated);
        if (counter.timesRepeated === Number(message) - 1) {
          this.gameStatus.text = '';
        }
      },
    });
    this.game.add(counter);
    counter.start();
  }

  private handleInputHold(evt: ex.Input.KeyEvent): void {
    if (evt.key === ex.Input.Keys.A) {
      this.gameService.room.send('move', 'left');
    }
    if (evt.key === ex.Input.Keys.D) {
      this.gameService.room.send('move', 'right');
    }
  }
}
