import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import * as ex from 'excalibur';
import { GameRoomState } from 'src/app/interfaces/game/schemas/game-room';
import { Paddle } from 'src/app/interfaces/game/actors/paddle';
import { Ball } from 'src/app/interfaces/game/actors/ball';
import { Vector } from 'excalibur';
@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css'],
})
export class GameRoomComponent implements OnInit {
	private ball: Ball;
	private currentTime: number;
	private engine: ex.Engine;
	private game: ex.Scene;
	private gameStatus: ex.Label;
	private localPaddle: Paddle;
	private localScore: ex.Label;
	private pendingInputs: Array<any>;
	private playerId: string;
	private previousRenderTimestamp = Date.now();
	private previousServerReceivedTime: number;
	private previousState: GameRoomState;
	private readonly paddleHeight = 20;
	private readonly paddleWidth = 75;
	private receivedStates = [];
	private remotePaddle: Paddle;
	private remoteScore: ex.Label;
	private serverReceivedTime: number;
	private serverUpdateTime: number;
	private state: GameRoomState;
	

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.pendingInputs = [];
    this.initGameEngine();
    this.initGameObjects();
    this.listenGameEvents();
    this.state = this.gameService.room.state;
    this.currentTime = Date.now();
    this.serverUpdateTime = this.gameService.room.state.serverUpdateTime;
  }

  private initGameEngine(): void {
    this.engine = new ex.Engine({
      canvasElementId: 'pong',
      width: 800,
      height: 600,
    });
    this.game = new ex.Scene();
    this.engine.add('game', this.game);
    this.engine.backgroundColor = ex.Color.Gray;
    this.engine.fixedUpdateFps = 60;
  }

  private initGameObjects(): void {
    this.localPaddle = this.createPaddle(
      0,
      ex.Color.fromHex('#555555'),
      ex.Keys.A,
      ex.Keys.D
    );
    this.remotePaddle = this.createPaddle(0, ex.Color.fromHex('#999999'));
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
      this.engine.onPostUpdate = this.postUpdate.bind(this);
      /*********** Colyseus Hooks */
      this.gameService.room.onStateChange((state: GameRoomState) =>
        this.handleStateChange(state)
      );
      this.gameService.room.onMessage('start', (message) =>
        this.handleBallStart(message)
      );
      this.gameService.room.onMessage(
        'game_win',
        (message) => (this.gameStatus.text = 'Player ' + message + ' wins!')
      );
      /****************************/
      this.engine.input.keyboard.on('hold', (evt) => this.handleInputHold(evt));
      this.engine.input.keyboard.on('release', (evt) =>
        this.handleInputRelease(evt)
      );
    });
  }

  private postUpdate() {
    this.currentTime = window.performance.now();
    this.serverUpdateTime = this.gameService.room.state.serverUpdateTime;
    this.interpolateState();
    this.predictionCorrection();

    if (this.previousState) {
      this.state.players.forEach((player, index) => {
        const previousPlayer = this.previousState.players[index];
        const paddle =
          player.id === this.playerId ? this.localPaddle : this.remotePaddle;
        const scoreLabel =
          player.id === this.playerId ? this.localScore : this.remoteScore;

        paddle.pos.x = this.extrapolate(
          player.paddle.x,
          previousPlayer.paddle.x
        );
        paddle.pos.y = this.extrapolate(
          player.paddle.y,
          previousPlayer.paddle.y
        );
        scoreLabel.text = player.score.toString();
        scoreLabel.pos.x =
          player.side === 'bottom' ? this.engine.drawWidth - 100 : 100;
        scoreLabel.pos.y =
          player.side === 'bottom' ? 100 : this.engine.drawHeight - 100;
      });
      this.ball.pos.x = this.extrapolate(
        this.state.ball.x,
        this.previousState.ball.x
      );
      this.ball.pos.y = this.extrapolate(
        this.state.ball.y,
        this.previousState.ball.y
      );
    }
  }

  private extrapolate(currentValue: number, previousValue: number): number {
    const smoothFactor = 0.1;
    let dt = this.currentTime - this.serverUpdateTime;
    if (dt > 0) {
      let velocity =
        (currentValue - previousValue) /
        (this.serverReceivedTime - this.previousServerReceivedTime);
      currentValue = currentValue + velocity * dt;
    }
    return currentValue * (1 - smoothFactor) + previousValue * smoothFactor;
  }

  private interpolateState(): void {
    let renderTimestamp = Date.now();
    let serverRenderTime =
      this.previousServerReceivedTime +
      (renderTimestamp - this.previousRenderTimestamp);

    let latestState = null;

    for (let i = this.receivedStates.length - 1; i >= 0; i--) {
      if (this.receivedStates[i].timestamp <= serverRenderTime) {
        latestState = this.receivedStates[i];
        break;
      }
    }

    if (latestState && latestState.length > 1) {
      let interpolation =
        (serverRenderTime - latestState.timestamp) /
        (latestState.next.timestamp - latestState.timestamp);

      this.state.ball.x =
        latestState.state.ball.x +
        (latestState.next.state.ball.x - latestState.state.ball.x) *
          interpolation;

      this.state.ball.y =
        latestState.state.ball.y +
        (latestState.next.state.ball.y - latestState.state.ball.y) *
          interpolation;

      for (let i = 0; i < this.state.players.length; i++) {
        this.state.players[i].paddle.x =
          latestState.state.players[i].paddle.x +
          (latestState.next.state.players[i].paddle.x -
            latestState.state.players[i].paddle.x) *
            interpolation;
      }
    }

    this.previousRenderTimestamp = renderTimestamp;
  }

  private predictionCorrection(): void {
    let latestState = this.receivedStates[this.receivedStates.length - 1];
	if (!latestState) return;

	let realPosition = new Vector(latestState.state.ball.x, 0);
	let direction = realPosition.sub(new Vector(this.state.ball.x, 0));
  
	if (direction.distance() > 1) {
	  this.state.ball.x = realPosition.x;
	} else if (direction.distance() > 0.001) {
	  const newVector = new Vector(this.state.ball.x, 0).add(
		direction
		  .normalize()
		  .cross(this.state.ball.vx * direction.distance() * 0.1)
	  );
	  this.state.ball.x = newVector.x;
	}

    for (let i = 0; i < this.state.players.length; i++) {
      let player = this.state.players[i];

      if (player.id == this.playerId) {
        let realPosition = new Vector(latestState.state.players[i].paddle.x, 0);
        let direction = realPosition.sub(new Vector(player.paddle.x, 0));

        if (direction.distance() > 1) {
          player.paddle.x = realPosition.x;
        } else if (direction.distance() > 0.001) {
          const newVector = new Vector(player.paddle.x, 0).add(
            direction
              .normalize()
              .cross(player.paddle.vx * direction.distance() * 0.1)
          );
          player.paddle.x = newVector.x;
        }
      }
    }
  }

  private handleStateChange(state: GameRoomState): void {
    this.reconcileState(state);
    this.previousServerReceivedTime = this.serverReceivedTime;
    this.previousState = this.state;
    this.state = state;
    this.receivedStates.push({
      state: this.state,
      timestamp: Date.now(),
      next: null,
    });
    if (this.receivedStates.length > 1) {
      this.receivedStates.at(-2).next = this.receivedStates.at(-1);
      if (this.receivedStates.length > 100) {
        this.receivedStates.shift();
      }
    }
    this.serverReceivedTime = Date.now();
  }

  private handleBallStart(message): void {
    const counter = new ex.Timer({
      interval: 1000,
      repeats: true,
      numberOfRepeats: +message,
      fcn: () => {
        this.gameStatus.text =
          'Starts in : ' + (+message - 1 - counter.timesRepeated);
        this.gameStatus.text =
          counter.timesRepeated === +message - 1 ? '' : this.gameStatus.text;
      },
    });

    this.game.add(counter);
    counter.start();
  }

  private handleInputHold(evt: ex.Input.KeyEvent): void {
    if ([ex.Input.Keys.A, ex.Input.Keys.D].includes(evt.key)) {
      this.sendInput(evt.key === ex.Input.Keys.A ? 'left' : 'right', 'keydown');
      const input = this.pendingInputs[this.pendingInputs.length - 1];
      this.paddleUpdate(input);
    }
  }

  private handleInputRelease(evt: ex.Input.KeyEvent): void {
    if ([ex.Input.Keys.A, ex.Input.Keys.D].includes(evt.key)) {
      this.sendInput(evt.key === ex.Input.Keys.A ? 'left' : 'right', 'keyup');
      const input = this.pendingInputs[this.pendingInputs.length - 1];
      this.paddleUpdate(input);
    }
  }

  private paddleUpdate(input: { type: string; direction: string }) {
    const player = this.state.players.find(
      (player) => player.id === this.playerId
    );
    if (player) {
      if (input.type === 'keydown') {
        if (player.paddle.keyReleased) {
          player.paddle.keyReleased = false;
          player.paddle.vx = input.direction === 'left' ? -5 : 5;
        }
      } else if (input.type === 'keyup') {
        player.paddle.keyReleased = true;
        player.paddle.vx = 0;
      }
      this.paddleMove(player.paddle);
    }
  }
  private sendInput(direction: string, type: string) {
    this.gameService.room.send('move', {
      direction,
      type,
      inputSequenceNumber: this.pendingInputs.length,
    });
    const inputSequenceNumber = this.pendingInputs.length;

    this.pendingInputs.push({
      direction,
      type,
      inputSequenceNumber,
    });
  }

  private reconcileState(gameState: any) {
    while (this.pendingInputs.length > 0) {
      const input = this.pendingInputs[0];
      const playerId = gameState.players.findIndex(
        (player) => player.id === this.playerId
      );
      if (
        input.inputSequenceNumber <=
        gameState.players[playerId].lastProcessedInput
      ) {
        this.pendingInputs.shift();
      } else {
        break;
      }
    }

    this.state = gameState;
  }

  private paddleMove(paddle: any) {
    if (paddle.keyReleased) {
      const duration = (Date.now() - paddle.keyPressTime) / 1000;
      const easingFactor = 0.1;
      paddle.vx += easingFactor * -paddle.vx * duration;
    } else if (!paddle.keyReleased) {
      paddle.x += paddle.vx;
      paddle.vx *= 1.02;
    }
  }

  private createGameObject<T extends ex.Actor>(
    GameObjectType: new (...args: any[]) => T,
    args: any[]
  ): T {
    const obj = new GameObjectType(...args);
    this.game.add(obj);
    return obj;
  }

  private createPaddle(
    y: number,
    color: ex.Color,
    leftKey?: ex.Input.Keys,
    rightKey?: ex.Input.Keys
  ): Paddle {
    return this.createGameObject(Paddle, [
      this.engine.drawWidth / 2,
      y,
      this.paddleWidth,
      this.paddleHeight,
      color,
      leftKey,
      rightKey,
    ]);
  }

  private createBall(): Ball {
    return this.createGameObject(Ball, [
      this.engine.drawWidth / 2,
      this.engine.drawHeight / 2,
      ex.Color.Green,
      10,
    ]);
  }

  private createScore(x: number): ex.Label {
    return this.createGameObject(ex.Label, [
      {
        x: x,
        y: this.engine.drawHeight - 100,
        text: '0',
        font: new ex.Font({ size: 14 }),
        color: ex.Color.White,
      },
    ]);
  }

  private createGameStatus(): ex.Label {
    return this.createGameObject(ex.Label, [
      {
        x: this.engine.halfDrawWidth - 50,
        y: this.engine.halfDrawHeight - 50,
        text: 'Waiting for players',
        color: ex.Color.White,
        font: new ex.Font({ size: 14 }),
      },
    ]);
  }
}
