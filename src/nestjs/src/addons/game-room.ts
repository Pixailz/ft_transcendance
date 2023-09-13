import { Schema, Context, type } from "@colyseus/schema";
import { Room } from "colyseus";

export enum GameRoomStatus {
	WAITING = 0,
	STARTED,
	FINISHED,
	INTERRUPTED,
}

export class GameRoomState extends Schema {
	@type("int8") public ballX = 0;
	@type("int8") public ballY = 0;
	@type("int8") public ballVX = 0;
	@type("int8") public ballVY = 0;

	@type("int8") public player1Y = 0;
	@type("int8") public player1X = 0;
	@type("int8") public player2Y = 0;
	@type("int8") public player2X = 0;

	@type("int8") public score1 = 0;
	@type("int8") public score2 = 0;

	@type("int8") public gameStatus = GameRoomStatus["WAITING"];

	constructor() {
		super();
	}
}

export class GameRoom extends Room<GameRoomState> {
	maxClients = 2;

	onCreate(options: any) {
		console.log("GameRoom created!", options);

		this.setState(new GameRoomState());
	}

	onJoin(client: any, options: any, auth: any) {
		console.log("client joined!", client.sessionId);

		if (this.clients.length === 2) {
			this.state.gameStatus = GameRoomStatus["STARTED"];
		}
	}

	onLeave(client: any, consented: boolean) {
		console.log("client left!", client.sessionId);
	}

	onDispose() {
		console.log("room disposed!");
	}
}
