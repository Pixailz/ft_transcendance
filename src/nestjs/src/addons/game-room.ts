import { Schema, Context, type } from "@colyseus/schema";
import { Room } from "colyseus";

export enum GameRoomStatus {
	WAITING = 0,
	STARTED,
	FINISHED,
	INTERRUPTED,
}

export class GameRoomState extends Schema {
	@type("int8") private ballX = 0;
	@type("int8") private ballY = 0;
	@type("int8") private ballVX = 0;
	@type("int8") private ballVY = 0;

	@type("int8") private player1Y = 0;
	@type("int8") private player1X = 0;
	@type("int8") private player2Y = 0;
	@type("int8") private player2X = 0;

	@type("int8") private score1 = 0;
	@type("int8") private score2 = 0;

	@type("int8") private gameStatus = GameRoomStatus["WAITING"];

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
	}

	onLeave(client: any, consented: boolean) {
		console.log("client left!", client.sessionId);
	}

	onDispose() {
		console.log("room disposed!");
	}
}
