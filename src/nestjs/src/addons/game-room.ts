import { Schema, ArraySchema, Context, type } from "@colyseus/schema";
import { Client, ClientArray, Room } from "colyseus";

export enum GameRoomStatus {
	WAITING = 0,
	STARTING,
	STARTED,
	FINISHED,
	INTERRUPTED,
}

class Canvas extends Schema {
	@type("int32") width = 0;
	@type("int32") height = 0;
}

class Ball extends Schema {
	@type("float32") x = 400;
	@type("float32") y = 300;
	@type("float32") vx = 0;
	@type("float32") vy = 0;
}

class Paddle extends Schema {
	@type("int32") width = 100;
	@type("int32") height = 0;
	@type("int32") x = 400;
	@type("int32") y = 0;
	@type("string") color = "";
}

class Player extends Schema {
	@type("string") public id = "";
	@type("int32") public score = 0;
	@type(Canvas) public canvas = new Canvas();
	@type(Paddle) public paddle = new Paddle();
	@type("string") public side: "top" | "bottom";
}

export class GameRoomState extends Schema {
	@type("int8") public gameStatus = GameRoomStatus["WAITING"];

	@type([Player]) public players = new ArraySchema<Player>();

	@type(Ball) public ball = new Ball();

	constructor() {
		super();
	}
}

export class GameRoom extends Room<GameRoomState> {
	private interval: NodeJS.Timeout;
	maxClients = 2;

	onCreate(options: any) {
		this.setState(new GameRoomState());

		this.setSimulationInterval(() => this.update());

		this.onMessage("move", (client, message) => {
			this.state.players.forEach((player) => {
				if (player.id == client.sessionId) {
					player.paddle.x += this.determineMovement(message);
				}
			});
			this.correctOverflow();
		});
	}

	private update() {
		if (this.state.gameStatus == GameRoomStatus["STARTED"]) {
			this.moveBall();
			this.checkCollisions();
			this.checkBallLose();
			this.checkGameOver();
		}
	}

	checkBallLose() {
		if (this.state.ball.y > 800) {
			const bottomPlayer = this.state.players.find(
				(player) => player.side == "bottom",
			);
			if (bottomPlayer) bottomPlayer.score += 1;
			this.broadcast("ball_lost", bottomPlayer ? bottomPlayer.id : null);
			this.startGame();
		} else if (this.state.ball.y < 0) {
			const topPlayer = this.state.players.find(
				(player) => player.side == "top",
			);
			if (topPlayer) topPlayer.score += 1;
			this.broadcast("ball_lost", topPlayer ? topPlayer.id : null);
			this.startGame();
		}
	}

	checkGameOver() {
		this.state.players.forEach((player) => {
			if (player.score == 5) {
				this.state.gameStatus = GameRoomStatus["FINISHED"];
				this.state.ball.x = 400;
				this.state.ball.y = 300;
				this.state.ball.vx = 0;
				this.state.ball.vy = 0;
				this.broadcast("game_win", player.id);
			}
		});
	}

	moveBall() {
		this.state.ball.x += this.state.ball.vx;
		this.state.ball.y += this.state.ball.vy;

		if (this.state.ball.x < 0 || this.state.ball.x > 800) {
			this.state.ball.vx *= -1;
		}
	}

	checkCollisions() {
		if (!this.state || !this.state.players || !this.state.ball) {
			console.error("State, players or ball is not defined");
			return;
		}

		this.state.players.forEach((player) => {
			if (!player.paddle) {
				console.error("Paddle is not defined for a player");
				return;
			}

			const paddleLeftEdge = player.paddle.x - player.paddle.width / 2;
			const paddleRightEdge = player.paddle.x + player.paddle.width / 2;
			const paddleTopEdge = player.paddle.y - player.paddle.height / 2;
			const paddleBottomEdge = player.paddle.y + player.paddle.height / 2;

			const ballIsWithinXBounds =
				this.state.ball.x >= paddleLeftEdge &&
				this.state.ball.x <= paddleRightEdge;
			const ballIsWithinYBounds =
				this.state.ball.y >= paddleTopEdge &&
				this.state.ball.y <= paddleBottomEdge;

			if (ballIsWithinXBounds && ballIsWithinYBounds) {
				this.state.ball.vy *= -1;
			}
		});
	}

	onJoin(client: any, options: any, auth: any) {
		const newPlayer = new Player();
		newPlayer.id = client.sessionId;
		newPlayer.side = this.state.players.length == 0 ? "bottom" : "top";
		this.state.players.push(newPlayer);
		this.state.players.forEach((player) => {
			player.canvas.width = 800;
			player.canvas.height = 600;
			player.paddle.width = 100;
			player.paddle.height = 20;
			player.paddle.x = 400;
			player.paddle.y = player.side == "bottom" ? 550 : 50;
			player.paddle.color = player.side == "bottom" ? "red" : "green";
		});
		this.state.assign(this.state);

		if (this.state.players.length == this.maxClients) {
			this.startGame();
		}
	}

	startGame() {
		this.state.gameStatus = GameRoomStatus["STARTING"];
		this.state.ball.x = 400;
		this.state.ball.y = 300;
		this.state.ball.vx = 0;
		this.state.ball.vy = 0;
		this.broadcast("start", 3);
		setTimeout(() => {
			this.state.gameStatus = GameRoomStatus["STARTED"];
		}, 3000);
		this.state.ball.vx = Math.random() * 10 - 5;
		this.state.ball.vy = 4;
	}

	onLeave(client: any, consented: boolean) {
		//this.state.players.delete(client.sessionId);
		this.state.gameStatus = GameRoomStatus["INTERRUPTED"];
	}

	correctOverflow() {
		this.state.players.forEach((player) => {
			player.paddle.x = Math.min(Math.max(player.paddle.x, 0), 800);
		});
	}

	onDispose() {
		console.log("Dispose GameRoom");
	}

	determineMovement(direction: string) {
		switch (direction) {
			case "left":
				return -10;
			case "right":
				return 10;
			default:
				return 0;
		}
	}
}
