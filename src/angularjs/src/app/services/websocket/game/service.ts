import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

import { WSGateway } from "../gateway";
import { WSService } from "../service";
import { DefLobbyI, GameOptionI, GameStateI, GameStatus, LobbyI, MapI, Maps } from "src/app/interfaces/game/game-room.interface";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class GameService {
	obsToDestroy: Subscription[] = [];

	room: LobbyI = DefLobbyI;
	roomid: string = "";
	in_game: boolean = false;
	maps: MapI[] = Maps;

	constructor(
		private wsGateway: WSGateway,
		private wsService: WSService,
		private router: Router,
	) {
		this.obsToDestroy.push(this.wsGateway.listenGameWaiting()
			.subscribe((data: any) => {
				console.log("[WS:game] GameWaiting event")
				this.roomid = data;
				this.room.status = GameStatus.WAITING;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenIsInGame()
			.subscribe((data: null) => {
				console.log("[WS:game] IsInGame event");
				this.in_game = true;
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
			.subscribe((data: GameStateI) => {
				console.log("[WS:game] GameReconnect event")
				this.room.status = GameStatus.STARTED;
				this.room.state = data;
			}
		));
		this.obsToDestroy.push(this.wsGateway.listenGameEnded()
			.subscribe((data: any) => {
				console.log("[WS:game] GameEnded event")
				this.in_game = false;
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
		this.router.navigate(["/play"], { replaceUrl: true });
	}

	ngOnDestroy()
	{
		console.log("[WS:Game] onDestroy");
		this.wsService.unsubscribeObservables(this.obsToDestroy);
	}

	searchGame(game_option: GameOptionI)
	{ this.wsGateway.searchGame(game_option); }

	joinGame(room_id: string)
	{ this.wsGateway.joinGame(room_id); }

	isInGame()
	{ this.wsGateway.isInGame(); }

	// reconnectGame()
	// { this.wsGateway.reconnectGame(this.room.id); }

	getInfo()
	{
		console.log("[GAME]");
		console.log(this.room);
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms * 1000));
