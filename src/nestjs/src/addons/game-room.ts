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
	@type("float32") vy = 4;
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
}

export class GameRoomState extends Schema {
	@type("int8") public gameStatus = GameRoomStatus["WAITING"];

	@type([Player]) public players = new ArraySchema<Player>();

	@type(Ball) public ball = null;

	constructor() {
		super();
	}
}

export class GameRoom extends Room<GameRoomState> {
	private interval: NodeJS.Timeout;
	maxClients = 2;

	onCreate(options: any) {
		this.setState(new GameRoomState());

		this.interval = setInterval(() => this.update(), 1000 / 60);

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
		if (this.state.ball.y > 800 || this.state.ball.y < 0) {
			this.broadcast("ball_lost");
			this.state.ball.x = 400;
			this.state.ball.y = 300;
			this.state.ball.vx = 0;
			this.state.ball.vy = 4;
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

		if (this.state.ball.x < 200 || this.state.ball.x > 600) {
			this.state.ball.vx *= -1;
		}
	}

	checkCollisions() {
		this.state.players.forEach((player) => {
			if (
				this.state.ball.x >=
					player.paddle.x - player.paddle.width / 2 &&
				this.state.ball.x <=
					player.paddle.x + player.paddle.width / 2 &&
				this.state.ball.y >=
					player.paddle.y - player.paddle.height / 2 &&
				this.state.ball.y <= player.paddle.y + player.paddle.height / 2
			) {
				this.state.ball.vy *= -1;
			}
		});
	}

	onJoin(client: any, options: any, auth: any) {
		const newPlayer = new Player();
		newPlayer.id = client.sessionId;
		this.state.players.push(newPlayer);

		if (this.state.players.length == this.maxClients) {
			this.startGame();
		}
	}

	startGame() {
		this.state.gameStatus = GameRoomStatus["STARTING"];
		this.broadcast("start", 3);
		setTimeout(() => {
			this.state.gameStatus = GameRoomStatus["STARTED"];
		}, 3000);
		this.state.ball = new Ball(400, 300, 0, 4);
	}

	onLeave(client: any, consented: boolean) {
		//this.state.players.delete(client.sessionId);
		this.state.gameStatus = GameRoomStatus["INTERRUPTED"];
	}

	correctOverflow() {
		this.state.players.forEach((player) => {
			player.paddle.x = Math.min(
				Math.max(player.paddle.x, 0),
				player.canvas.width,
			);
		});
	}

	onDispose() {
		clearInterval(this.interval);
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
