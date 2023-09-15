import { Schema, ArraySchema, type } from "@colyseus/schema";
import { Room } from "colyseus";

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
	@type("int32") height = 20;
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
	@type("int8") public gameStatus = GameRoomStatus.WAITING;

	@type([Player]) public players = new ArraySchema<Player>();

	@type(Ball) public ball = new Ball();
}

export class GameRoom extends Room<GameRoomState> {
	maxClients = 2;

	onCreate(options: any) {
		this.setState(new GameRoomState());

		this.setSimulationInterval(() => this.update());

		this.onMessage("move", (client, message) => {
			const player = this.getPlayerById(client.sessionId);
			if (player) {
				player.paddle.x += this.determineMovement(message);
				this.correctOverflow(player);
			}
		});
	}

	onJoin(client: any) {
		const newPlayer = new Player();
		newPlayer.id = client.sessionId;
		newPlayer.side = this.state.players.length == 0 ? "bottom" : "top";
		newPlayer.paddle.y = newPlayer.side === "bottom" ? 550 : 50;
		newPlayer.paddle.color = newPlayer.side === "bottom" ? "red" : "green";
		this.state.players.push(newPlayer);

		if (this.state.players.length === this.maxClients) {
			this.startGame();
		}
	}

	onLeave(client) {
		this.state.gameStatus = GameRoomStatus.INTERRUPTED;
		this.state.players.deleteAt(this.getPlayerIdBySessId(client.sessionId));
	}

	getPlayerIdBySessId(sessId: string) {
		return this.state.players.findIndex((player) => player.id === sessId);
	}

	onDispose() {
		console.log("Dispose GameRoom");
	}

	private update() {
		if (this.state.gameStatus === GameRoomStatus.STARTED) {
			this.moveBall();
			this.checkCollisions();
			this.checkBallLose();
		}
	}

	private moveBall() {
		this.state.ball.x += this.state.ball.vx;
		this.state.ball.y += this.state.ball.vy;

		if (this.state.ball.x < 0 || this.state.ball.x > 800) {
			this.state.ball.vx *= -1;
		}
	}

	private checkCollisions() {
		this.state.players.forEach((player) => {
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
				this.state.ball.vx +=
					(this.state.ball.x - player.paddle.x) / 10;
				this.state.ball.vy +=
					(this.state.ball.y - player.paddle.y) / 10;
			}
		});
	}

	private checkBallLose() {
		if (this.state.ball.y > 800) {
			this.ballLose(this.getPlayerBySide("bottom"));
		} else if (this.state.ball.y < 0) {
			this.ballLose(this.getPlayerBySide("top"));
		}
	}

	private ballLose(player: Player | undefined) {
		if (player) {
			this.playerScoreUpdate(player);
			this.checkGameOver();
			this.startGame();
		}
	}

	private playerScoreUpdate(player: Player) {
		player.score += 1;
		this.broadcast("ball_lost", player.id);
	}

	private checkGameOver() {
		this.state.players.forEach((player) => {
			if (player.score == 5) {
				this.state.gameStatus = GameRoomStatus.FINISHED;
				this.broadcast("game_win", player.id);
				this.setSimulationInterval();
			}
		});
	}

	private startGame() {
		if (this.state.gameStatus === GameRoomStatus.FINISHED) {
			return;
		}
		this.state.gameStatus = GameRoomStatus.STARTING;
		this.broadcast("start", 3);
		setTimeout(() => {
			this.state.gameStatus = GameRoomStatus.STARTED;
		}, 3000);
		this.resetBall();
	}

	private resetBall() {
		this.state.ball.vx = Math.random() * 10 - 5;
		this.state.ball.vy = 4;
		this.state.ball.x = 400;
		this.state.ball.y = 300;
	}

	private getPlayerById(id: string) {
		return this.state.players.find((player) => player.id === id);
	}

	private getPlayerBySide(side: string) {
		return this.state.players.find((player) => player.side === side);
	}

	private correctOverflow(player: Player) {
		player.paddle.x = Math.min(Math.max(player.paddle.x, 0), 800);
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
