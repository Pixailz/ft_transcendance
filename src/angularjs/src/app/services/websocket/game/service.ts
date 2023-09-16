import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

import { WSGateway } from "../gateway";
import { WSService } from "../service";
import { DefLobbyI, DefPlayer, GameOptionI, GameStatus, LobbyI } from "src/app/interfaces/game/game.interface";
import { UserI } from "src/app/interfaces/user.interface";

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
			.subscribe((data: any) => {
				console.log("[WS:game] GameWaiting event")
				this.room.status = GameStatus.WAITING;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenIsInGame()
			.subscribe((data: any) => {
				console.log("[WS:game] IsInGame event");
				console.log(data);
				this.in_game = true;
				this.room.id = data;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenGameStarted()
			.subscribe((data: any) => {
				console.log("[WS:game] GameStarted event")
				this.room.status = GameStatus.STARTED;
				this.room.id = data.id;
				this.room.opponent.user = data.opponent
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenGameReconnect()
			.subscribe((data: UserI) => {
				console.log("[WS:game] GameReconnect event")
				this.room.status = GameStatus.STARTED;
				this.room.opponent.user = data;
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
		this.room.opponent.user.id = -1;
		this.room.opponent.user.ftLogin = "";
		this.room.opponent.user.nickname = "";
		this.room.opponent.user.lastSeen = new Date();
		this.room.opponent.user.picture = "";
		this.room.opponent.user.email = "";
		this.room.opponent.user.status = 0
		this.room.opponent.pos.x = 0;
		this.room.opponent.pos.x = 0;
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
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms * 1000));
