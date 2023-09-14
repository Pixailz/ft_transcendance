import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import * as ex from 'excalibur';
import { GameRoomState } from 'src/app/interfaces/game/schemas/game-room';
import { Paddle } from 'src/app/interfaces/game/actors/paddle';
import { Ball } from 'src/app/interfaces/game/actors/ball';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css'],
})
export class GameRoomComponent implements OnInit {
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
  private playerId: string;

  constructor(private gameService: GameService) { }

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
    this.localScore = this.createScore(0);
    this.remoteScore = this.createScore(0);
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
    this.playerId = this.gameService.room.sessionId;

    this.engine.start().then(() => {
      this.engine.goToScene('game');

      this.gameService.room.onStateChange((state: GameRoomState) => this.handleStateChange(state));
      this.gameService.room.onMessage('start', (message) => this.handleBallStart(message));
      this.gameService.room.onMessage('game_win', (message) => this.gameStatus.text = 'Player ' + message + ' wins!');

      this.engine.input.keyboard.on('hold', (evt) => this.handleInputHold(evt));
    });
  }

  private handleStateChange(state: GameRoomState): void {
    state.players.forEach((player) => {
      const paddle = player.id === this.playerId ? this.localPaddle : this.remotePaddle;
      const scoreLabel = player.id === this.playerId ? this.localScore : this.remoteScore;

      paddle.pos.x = player.paddle.x;
      paddle.pos.y = player.paddle.y;
      scoreLabel.text = String(player.score);
      scoreLabel.pos.x = player.side === 'bottom' ? this.engine.drawWidth - 100 : 100;
      scoreLabel.pos.y = player.side === 'bottom' ? 100 : this.engine.drawHeight - 100;
    });

    this.ball.pos.x = state.ball.x;
    this.ball.pos.y = state.ball.y;
  }

  private handleBallStart(message): void {
    const counter = new ex.Timer({
      interval: 1000,
      repeats: true,
      numberOfRepeats: +message,
      fcn: () => {
        this.gameStatus.text = 'Starts in : ' + (+message - 1 - counter.timesRepeated);
        this.gameStatus.text = counter.timesRepeated === +message - 1 ? '' : this.gameStatus.text;
      },
    });

    this.game.add(counter);
    counter.start();
  }

  private handleInputHold(evt: ex.Input.KeyEvent): void {
    if ([ex.Input.Keys.A, ex.Input.Keys.D].includes(evt.key)) {
      this.gameService.room.send('move', evt.key === ex.Input.Keys.A ? 'left' : 'right');
    }
  }

  private createGameObject<T extends ex.Actor>(GameObjectType: new (...args: any[]) => T, args: any[]): T {
    const obj = new GameObjectType(...args);
    this.game.add(obj);
    return obj;
  }

  private createPaddle(y: number, color: ex.Color, leftKey?: ex.Input.Keys, rightKey?: ex.Input.Keys): Paddle {
    return this.createGameObject(Paddle, [this.engine.drawWidth / 2, y, this.paddleWidth, this.paddleHeight, color, leftKey, rightKey])
  }

  private createBall(): Ball {
    return this.createGameObject(Ball, [this.engine.drawWidth / 2, this.engine.drawHeight / 2, 20, 20, ex.Color.Red]);
  }

  private createScore(x: number): ex.Label {
    return this.createGameObject(ex.Label, [{ x: x, y: this.engine.drawHeight - 100, text: '0', color: ex.Color.White }]);
  }


  private createGameStatus(): ex.Label {
    return this.createGameObject(ex.Label, [{
      x: this.engine.halfDrawWidth - 50,
      y: this.engine.halfDrawHeight,
      text: 'Waiting for players',
      color: ex.Color.White
    }]);
  }
}