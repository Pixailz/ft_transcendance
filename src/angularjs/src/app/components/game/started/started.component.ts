import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ex from 'excalibur';
import { Paddle } from 'src/app/interfaces/game/actors/paddle';
import { Ball } from 'src/app/interfaces/game/actors/ball';
import { Vector } from 'excalibur';
import { DevTool } from '@excaliburjs/dev-tools';
import { GameService } from 'src/app/services/websocket/game/service';
import { GameStateI, GameStatus } from 'src/app/interfaces/game/game-room.interface';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { Subscription } from 'rxjs';
import { WSService } from 'src/app/services/websocket/service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-game-started',
	templateUrl: './started.component.html',
	styleUrls: ['./started.component.scss'],
})
export class GameStartedComponent implements OnInit {
	private ball: Ball;
	private currentTime: number;
	private engine: ex.Engine;
	private game: ex.Scene;
	private gameStatus: ex.Label;
	private localPaddle: Paddle;
	private localScore: ex.Label;
	private pendingInputs: Array<any>;
	private previousRenderTimestamp = Date.now();
	private previousServerReceivedTime: number;
	private readonly paddleHeight = 75;
	private readonly paddleWidth = 20;
	private receivedStates = [];
	private remotePaddle: Paddle;
	private remoteScore: ex.Label;
	private serverReceivedTime: number;
	private serverUpdateTime: number;
	private side_id: string;
	
	// Debug Elements
	private devTool: DevTool | null = null;
	private FPSToolsTimer: ex.Timer;
	private isDevToolsEnabled: boolean = false;
	private isFPSToolsEnabled: boolean = false;
	private graphic_sec_prompt: ex.Label;
	private graphic_ms_prompt: ex.Label;
	private server_sec_prompt: ex.Label;
	private server_ms_prompt: ex.Label;

	obsToDestroy: Subscription[] = [];

	constructor(
		private userService: UserService,
		private gameService: GameService,
		private wsGateway: WSGateway,
		private wsService: WSService,
	) {
	}

	ngOnInit(): void {
		this.pendingInputs = [];
		this.initGameEngine();
		this.initGameObjects();
		this.listenGameEvents();
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
		this.engine.fixedUpdateFps = 64;
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
		this.graphic_sec_prompt = this.createDebugLabel('graphic_ms');
		this.graphic_ms_prompt = this.createDebugLabel('graphic_sec');
		this.server_sec_prompt = this.createDebugLabel('server_ms');
		this.server_ms_prompt = this.createDebugLabel('server_sec');
		this.FPSToolsTimer = new ex.Timer({
			interval: 200,
			repeats: true,
			fcn: this.FPSToolsHelper.bind(this),
		});
		this.game.add(this.FPSToolsTimer);
	}

	private listenGameEvents(): void {
		this.gameService.room.state.players.forEach((player) => {
			if (player.id === this.userService.user.id)
				this.side_id = player.side_id;
		});
		this.engine.start().then(() => {
			this.engine.goToScene('game');
			this.engine.onPostUpdate = this.postUpdate.bind(this);
			this.obsToDestroy.push(this.wsGateway.listenGameStarting()
				.subscribe((data: any) => {
					console.log("[WS:game] GameStarting event")
					this.handleBallStart("3");
				}
			));
			this.obsToDestroy.push(this.wsGateway.listenGameState()
				.subscribe((state: GameStateI) => {
					// console.log("[WS:game] GameState event")
					this.handleStateChange(state);
				}
			));
			this.engine.input.keyboard.on('hold', (evt) => this.handleInputHold(evt));
			this.engine.input.keyboard.on('release', (evt) =>
				this.handleInputRelease(evt)
			);
		});
	}

	FPSToolsHelper(){
		if (!this.isFPSToolsEnabled)
		{
			this.graphic_sec_prompt.text = '';
			this.graphic_ms_prompt.text = '';
			this.server_ms_prompt.text = '';
			this.server_sec_prompt.text = '';
			return ;
		}
		this.graphic_sec_prompt.text = `graphic fps:${this.engine.stats.currFrame.fps.toFixed(2)}`;
		this.graphic_ms_prompt.text = `graphic update time (ms):${this.engine.stats.currFrame.delta}`;
		this.server_ms_prompt.text = `server update time (ms):${(this.serverReceivedTime - this.previousServerReceivedTime)}`;
		this.server_sec_prompt.text = `server fps:${(1000 / (this.serverReceivedTime - this.previousServerReceivedTime)).toFixed(2)}`;
	}

	private postUpdate() {
		this.currentTime = window.performance.now();
		this.serverUpdateTime = this.gameService.room.state.serverUpdateTime;
		this.interpolateState();
		this.predictionCorrection();
		if (this.gameService.room.previousState?.players.length > 1) {
			this.gameService.room.state.players.forEach((player, index) => {
				const previousPlayer = this.gameService.room.previousState.players[index];
				const paddle =
				player.side_id === this.side_id ? this.localPaddle : this.remotePaddle;
				const scoreLabel =
				player.side_id === this.side_id ? this.localScore : this.remoteScore;

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
				player.side_id === 'right' ? this.engine.drawWidth - 100 : 100;
				scoreLabel.pos.y =
				player.side_id === 'right' ? 100 : this.engine.drawHeight - 100;
			});
			this.ball.pos.x = this.extrapolate(
				this.gameService.room.state.ball.x,
				this.gameService.room.previousState.ball.x
			);
			this.ball.pos.y = this.extrapolate(
				this.gameService.room.state.ball.y,
				this.gameService.room.previousState.ball.y
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

			this.gameService.room.state.ball.x =
				latestState.state.ball.x +
				(latestState.next.state.ball.x - latestState.state.ball.x) *
				interpolation;

			this.gameService.room.state.ball.y =
				latestState.state.ball.y +
				(latestState.next.state.ball.y - latestState.state.ball.y) *
				interpolation;

			for (let i = 0; i < this.gameService.room.state.players.length; i++) {
				this.gameService.room.state.players[i].paddle.y =
				latestState.state.players[i].paddle.y +
				(latestState.next.state.players[i].paddle.y -
					latestState.state.players[i].paddle.y) *
					interpolation;
			}
		}

		this.previousRenderTimestamp = renderTimestamp;
	}

	private handleStateChange(state: GameStateI): void {
		this.reconcileState(state);
		this.previousServerReceivedTime = this.serverReceivedTime;
		this.gameService.room.previousState = this.gameService.room.state;
		this.gameService.room.state = state;
		this.receivedStates.push({
			state: this.gameService.room.state,
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
	private predictionCorrection(): void {
		let latestState = this.receivedStates[this.receivedStates.length - 1];
		if (!latestState) return;

		let realPosition = new Vector(latestState.state.ball.x, latestState.state.ball.y);
		let direction = realPosition.sub(new Vector(this.gameService.room.state.ball.x, this.gameService.room.state.ball.y));

		if (direction.distance() > 1) {
			this.gameService.room.state.ball.x = realPosition.x;
			this.gameService.room.state.ball.y = realPosition.y;
		} else if (direction.distance() > 0.001) {
			const newVector = new Vector(this.gameService.room.state.ball.x, this.gameService.room.state.ball.y).add(
				direction
				.normalize()
				.cross(this.gameService.room.state.ball.vx * direction.distance() * 0.1)
				.cross(this.gameService.room.state.ball.vy * direction.distance() * 0.1)
			);
			this.gameService.room.state.ball.x = newVector.x;
			this.gameService.room.state.ball.y = newVector.y;
		}

		for (let i = 0; i < this.gameService.room.state.players.length; i++) {
			let player = this.gameService.room.state.players[i];

			if (player.side_id == this.side_id) {
				let realPosition = new Vector(latestState.state.players[i].paddle.x, latestState.state.players[i].paddle.y);
				let direction = realPosition.sub(new Vector(player.paddle.x, player.paddle.y));

				if (direction.distance() > 1) {
					player.paddle.x = realPosition.x;
					player.paddle.y = realPosition.y;
				} else if (direction.distance() > 0.001) {
					const newVector = new Vector(player.paddle.x, player.paddle.y).add(
						direction
						.normalize()
						.cross(player.paddle.vy * direction.distance() * 0.1)
					);
					player.paddle.y = newVector.y;
				}
			}
		}
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
		if ([ex.Input.Keys.S, ex.Input.Keys.W].includes(evt.key)) {
			this.sendInput(evt.key === ex.Input.Keys.S ? 'bottom' : 'up', 'keydown');
			const input = this.pendingInputs[this.pendingInputs.length - 1];
			this.paddleUpdate(input);
		}
	}

	private handleInputRelease(evt: ex.Input.KeyEvent): void {
		if ([ex.Input.Keys.S, ex.Input.Keys.W].includes(evt.key)) {
			this.sendInput(evt.key === ex.Input.Keys.S ? 'bottom' : 'up', 'keyup');
			const input = this.pendingInputs[this.pendingInputs.length - 1];
			this.paddleUpdate(input);
		}
		if (ex.Input.Keys.F9 === evt.key && !this.isDevToolsEnabled)
		{
			this.devTool = new DevTool(this.engine);
			this.isDevToolsEnabled = true;
		}
		if (ex.Input.Keys.F8 === evt.key && this.isFPSToolsEnabled) {
			this.isFPSToolsEnabled = !this.isFPSToolsEnabled;
			this.FPSToolsTimer.stop();
			this.FPSToolsHelper();
		} else if (ex.Input.Keys.F8 === evt.key && !this.isFPSToolsEnabled) {
			this.isFPSToolsEnabled = !this.isFPSToolsEnabled;
			this.FPSToolsTimer.start();
		}
	}

	private paddleUpdate(input: { type: string; direction: string }) {
		const player = this.gameService.room.state.players.find(
			(player) => player.side_id === this.side_id
		);
		if (player) {
			// if (input.type === 'keydown') {
			// 	if (player.paddle.keyReleased) {
			// 	player.paddle.keyReleased = false;
			// 	player.paddle.vy = input.direction === 'bottom' ? -5 : 5;
			// 	}
			// } else
			if (input.type === 'keyup') {
				player.paddle.keyReleased = true;
				player.paddle.vy = 0;
			}
			this.paddleMove(player.paddle);
		}
	}
	private sendInput(direction: string, type: string) {
		this.wsGateway.sendInput(direction, type, this.pendingInputs.length);
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
			const side_id = gameState.players.findIndex(
				(player) => player.side_id === this.side_id
			);
			if (
				input.inputSequenceNumber <=
				gameState.players[side_id].lastProcessedInput
			) {
				this.pendingInputs.shift();
			} else {
				break;
			}
		}

		this.gameService.room.state = gameState;
	}

	private paddleMove(paddle: any) {
		if (paddle.keyReleased) {
			const duration = (Date.now() - paddle.keyPressTime) / 1000;
			const easingFactor = 0.1;
			paddle.vy += easingFactor * -paddle.vy * duration;
		} else if (!paddle.keyReleased) {
			paddle.y += paddle.vy;
			paddle.vy *= 1.01;
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
		x: number,
		color: ex.Color,
		leftKey?: ex.Input.Keys,
		rightKey?: ex.Input.Keys
	): Paddle {
		return this.createGameObject(Paddle, [
			x,
			this.engine.drawHeight / 2,
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

	private createDebugLabel(model: string) {
		let x, y;
		switch (model) {
			case 'graphic_sec':
				x = this.engine.drawWidth - 250;
				y = this.engine.drawHeight - 24;
				break;
			case 'graphic_ms':
				x = this.engine.drawWidth - 250;
				y = this.engine.drawHeight - 12;
				break;
			case 'server_sec':
				x = this.engine.drawWidth - 250;
				y = this.engine.drawHeight - 36;
				break;
			case 'server_ms':
				x = this.engine.drawWidth - 250;
				y = this.engine.drawHeight - 48;
				break;
		}
		return this.createGameObject(ex.Label, [
			{
				x: x,
				y: y,
				text: "",
				font: new ex.Font({ size: 14 }),
				color: ex.Color.White,
			},
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

	ngOnDestroy(): void {
		this.obsToDestroy.forEach((obs) => obs.unsubscribe());
		if (this.devTool) delete this.devTool;
		this.engine.stop();
	}
}