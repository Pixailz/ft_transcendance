import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

import { WSGateway } from "../gateway";
import { WSService } from "../service";
import { UserI } from "src/app/interfaces/user/user.interface";
import { DefLobbyI, GameOptionI, GameStatus, LobbyI } from "src/app/interfaces/game/game-room.interface";

@Injectable({
	providedIn: "root",
})
export class GameService {
	obsToDestroy: Subscription[] = [];

	room: LobbyI = DefLobbyI;
	in_game: boolean = false;

	constructor(
		private wsGateway: WSGateway,
		private wsService: WSService,
	) {
		this.obsToDestroy.push(this.wsGateway.listenGameWaiting()
			.subscribe((data: null) => {
				console.log("[WS:game] GameWaiting event")
				this.room.status = GameStatus.WAITING;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenIsInGame()
			.subscribe((room_id: string) => {
				console.log("[WS:game] IsInGame event");
				console.log(room_id);
				this.in_game = true;
				this.room.id = room_id;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenGameStarting()
			.subscribe((data: any) => {
				console.log("[WS:game] GameStarting event")
				this.room.status = GameStatus.STARTED;
				this.room.id = data[0];
				this.room.state = data[1];
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenGameReconnect()
			.subscribe((data: UserI) => {
				console.log("[WS:game] GameReconnect event")
				this.room.status = GameStatus.STARTED;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenGameEnded()
			.subscribe((data: any) => {
				console.log("[WS:game] GameEnded event")
				this.resetRoom();
			}
		));
		this.wsGateway.isInGame();
	}

	async resetRoom()
	{
		this.in_game = false;
		this.room.status = GameStatus.LOBBY;
		this.room.id = "";
		for (var i = 0; i < this.room.players.length; i++)
		{
			this.room.players[i].id = -1;
			this.room.players[i].ftLogin = "";
			this.room.players[i].nickname = "";
			this.room.players[i].lastSeen = new Date();
			this.room.players[i].picture = "";
			this.room.players[i].email = "";
			this.room.players[i].status = 0;
		}
	}

	ngOnDestroy()
	{
		console.log("[WS:Game] onDestroy");
		this.wsService.unsubscribeObservables(this.obsToDestroy);
	}

	searchGame(game_option: GameOptionI)
	{ this.wsGateway.searchGame(game_option); }

	isInGame()
	{ this.wsGateway.isInGame(); }

	reconnectGame()
	{ this.wsGateway.reconnectGame(this.room.id); }

	getInfo()
	{
		console.log("[GAME]");
		console.log(this.room);
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms * 1000));
