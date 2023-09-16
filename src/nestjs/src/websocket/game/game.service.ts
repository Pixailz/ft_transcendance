import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { WSSocket } from "../socket.service";
import { randomBytes } from "crypto";
import { UserService } from "src/adapter/user/service";
import { Sanitize } from "../../sanitize-object";

export interface Pos {
	x				: number,
	y				: number,
}

export const DefPos: Pos = {
	x				: 0,
	y				: 0,
}

export interface Player {
	user			: any,
	socket			: string,
	pos				: Pos,
}

export const DefPlayer: Player = {
	user			: {},
	socket			: "",
	pos				: DefPos,
}

export enum GameStatus {
	LOBBY,
	WAITING,
	STARTED,
}

export interface LobbyI {
	id				: string,
	type			: string,
	playerA			: Player
	playerB			: Player
}

export const DefLobbyI: LobbyI = {
	id				: "",
	type			: "",
	playerA			: DefPlayer,
	playerB			: DefPlayer,
}

@Injectable()
export class WSGameService {
	constructor(
		private sanitize: Sanitize,
		private userService: UserService,
		private wsSocket: WSSocket,
	) {}

	room: any = {};

	gameSearchOpponent(player: Player, game_opt: any)
	{
		var founded: boolean = false;

		for (var i in this.room)
		{
			if (this.room[i].playerA.socket !== player.socket &&
				this.room[i].playerB.socket === "" &&
				this.room[i].type === game_opt.type)
			{
				founded = true;
				break ;
			}
		}
		if (founded)
		{
			this.room[i].playerB = player;
			return (this.room[i]);
		}
		else
		{
			const id = randomBytes(16).toString("hex");
			this.room[id] = ({
				id: id,
				type: game_opt.type,
				playerA: player,
				playerB: DefPlayer,
			})
		}
		return (DefLobbyI);
	}

	async gameSearch(server: Server, socket: Socket, game_opt: any)
	{
		const player = {
			user: this.sanitize.User(await this.userService.getInfoById(
				this.wsSocket.getUserId(socket.id)
			)),
			socket:	socket.id,
			pos:	DefPos,
		}
		const lobby = this.gameSearchOpponent(player, game_opt);
		if (lobby.id !== "")
			this.startGame(server, lobby);
		else
			socket.emit("gameWaiting");
	}

	isInGame(server: Server, socket: Socket)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		var isInGame: boolean = false;

		for (var game_id in this.room)
		{
			if (this.room[game_id].playerA.user.id === user_id ||
				this.room[game_id].playerB.user.id === user_id)
			{
				isInGame = true;
				break;
			}
		}
		if (isInGame)
			server.to(socket.id).emit("isInGame", game_id);
	}

	disconnect(socket_id: string)
	{
		for (var game_id in this.room)
		{
			if (this.room[game_id].playerA.socket === socket_id)
				this.room[game_id].playerA.socket = "";
			if (this.room[game_id].playerB.socket === socket_id)
				this.room[game_id].playerB.socket = "";
		}
	}

	gameReconnect(server: Server, socket: Socket, room_id: string)
	{
		const user_id = this.wsSocket.getUserId(socket.id);
		var user: any = {};
		var is_started: boolean = false;

		for (var game_id in this.room)
		{
			if (this.room[game_id].playerA.user.id === user_id)
			{
				this.room[game_id].playerA.socket = socket.id;
				user = this.room[game_id].playerB.user; break;
			}
			if (this.room[game_id].playerB.user.id === user_id)
			{
				this.room[game_id].playerB.socket = socket.id;
				user = this.room[game_id].playerA.user; break;
			}
		}
		if (this.room[game_id].playerA.socket !== "" &&
			this.room[game_id].playerB.socket !== "")
			socket.emit("gameReconnect", user);
		else
			socket.emit("gameWaiting");
	}

	async startGame(server: Server, lobby: LobbyI)
	{
		console.log("game started", this.room);
		server.to(lobby.playerA.socket).emit("gameStarted", {
			id: lobby.id, opponent: lobby.playerB.user});
		server.to(lobby.playerB.socket).emit("gameStarted", {
			id: lobby.id, opponent: lobby.playerA.user});
		await sleep(25_000);
		server.to(lobby.playerA.socket).emit("gameEnded");
		server.to(lobby.playerB.socket).emit("gameEnded");
		delete this.room[lobby.id];
	}

	updateGameStatus(server: Server, socket: Socket, status: any)
	{
		console.log(`status received from socket id ${socket.id}`);
		console.log(status);
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

