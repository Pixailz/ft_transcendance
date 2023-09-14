import { Schema, Context, type } from "@colyseus/schema";
import { Client, ClientArray, Room } from "colyseus";

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

	@type("int8") public player1X = 0;
	@type("int8") public player2X = 0;
	@type("string") public player1Id = "";
	@type("string") public player2Id = "";

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

		this.onMessage("move", (client, message) => {
			if (this.state.player1Id == client.sessionId) {
				this.state.player1X += this.determineSide(message);
			} else {
				this.state.player2X += this.determineSide(message);
			}
		});
	}

	onJoin(client: any, options: any, auth: any) {
		console.log("client joined!", client.sessionId);
		this.state.player1Id == ""
			? (this.state.player1Id = client.sessionId)
			: (this.state.player2Id = client.sessionId);

		if (this.clients.length === 2) {
			this.state.gameStatus = GameRoomStatus["STARTED"];
		}
	}

	onLeave(client: any, consented: boolean) {
		console.log("client left!", client.sessionId);
		if (this.clients.length === 1) {
			this.state.gameStatus = GameRoomStatus["INTERRUPTED"];
		}
		if (this.state.player1Id == client.sessionId) {
			this.state.player1Id = "";
		} else {
			this.state.player2Id = "";
		}
	}

	onDispose() {
		console.log("room disposed!");
	}

	determineSide(position: string) {
		if (position == "left") return -10;
		if (position == "right") return 10;
		return 0;
	}
}
