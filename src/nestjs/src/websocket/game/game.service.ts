import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { WSSocket } from "../socket.service";
import { randomBytes } from "crypto";
import { UserService } from "src/adapter/user/service";
import { Sanitize } from "../../modules/database/sanitize-object";
import { DefGameStateI, DefPaddleI, DefPlayerI, GameStatus, LobbyI, LobbyStatus, PlayerI, PlayerSockI } from "./game.interface";
import { UserEntity } from "src/modules/database/user/entity";

@Injectable()
export class WSGameService {
	constructor(
		private sanitize: Sanitize,
		private userService: UserService,
		private wsSocket: WSSocket,
	) {}

	room: any = {};

	getInfo()
	{
		for (var room_id in this.room)
		{
			console.log(this.room[room_id]);
		}
	}

	async gameSearch(server: Server, socket: Socket, game_opt: any)
	{
		var player: PlayerSockI = {
			user: this.sanitize.User(await this.userService.getInfoById(
				this.wsSocket.getUserId(socket.id)
			)),
			socket:	socket.id,
		}
		const room_id = this.gameSearchOpponent(player, game_opt);
		const room = this.room[room_id];
		if (this.isFullRoom(room))
			this.startGame(server, room_id);
		else
			socket.emit("gameWaiting");
	}

	gameSearchOpponent(player: PlayerSockI, game_opt: any)
	{
		var room_id = this.gameSearchRoom(player, game_opt);

		if (room_id !== "")
			this.addPlayerToRoom(player, room_id);
		else
			return (this.createRoom(player, game_opt));
		return (room_id);
	}

	gameSearchRoom(player: PlayerSockI, game_opt: any): string
	{
		for (var room_id in this.room)
		{
			const cur_room = this.room[room_id];
			if (cur_room.status === LobbyStatus.STARTED) continue ;
			if (cur_room.type !== game_opt.type) continue ;
			if (!this.isInRoom(player, cur_room) && !this.isFullRoom(cur_room))
				return (room_id);
		}
		return ("");
	}

	isInRoom(player: PlayerSockI, room: LobbyI): boolean
	{
		for (var player_id in room.players)
			if (room.players[player_id].user.id === player.user.id)
				return (true);
		return (false);
	}

	isFullRoom(room: LobbyI): boolean
	{
		var max_player: number = 0;
		var nb_player: number = 0;
		switch (room.type)
		{
			case ("normal"): max_player = 2; break ;
		}
		for (var friend_id in room.players)
			nb_player++;
		return (nb_player === max_player);
	}

	addPlayerToRoom(player_sock: PlayerSockI, room_id: string)
	{
		const user_id_str: string = player_sock.user.id.toString();

		if (!this.room[room_id].players)
			this.room[room_id].players = { };
		this.room[room_id].players[user_id_str] = player_sock;

		const side_id = this.isFullRoom(this.room[room_id]) ? "top" : "bottom";
		var player = Object.assign({}, DefPlayerI);
		player.id  = player_sock.user.id;
		player.side_id = side_id;
		player.paddle = Object.assign({}, DefPaddleI);
		player.paddle.y = side_id === "bottom" ? 550 : 50;
		player.paddle.color = side_id === "bottom" ? "red" : "green";
		this.room[room_id].state.players.push(player);
	}

	createRoom(player: PlayerSockI, game_opt: any)
	{
		var room_id = `${this.getUidPart(8)}-`;

		for (var i = 0; i < 4; i++)
			room_id += `${this.getUidPart(4)}-`;
		room_id += this.getUidPart(8);
		this.room[room_id] = {
			type: game_opt.type,
			state: DefGameStateI,
		}
		this.addPlayerToRoom(player, room_id);
		return (room_id);
	}

	getUidPart(size: number)
	{ return (randomBytes(size).toString("hex")); }

	isInGame(server: Server, socket: Socket)
	{
		const user_id_str = this.wsSocket.getUserId(socket.id).toString();
		var isInGame: boolean = false;

		for (var room_id in this.room)
		{
			for (var player_id in this.room[room_id].players)
			{

				if (player_id === user_id_str)
				{
					isInGame = true;
					break;
				}
			}
		}
		if (isInGame)
			server.to(socket.id).emit("isInGame", room_id);
	}

	disconnect(socket_id: string)
	{
		for (var game_id in this.room)
		{
			for (var user_id in this.room[game_id].players)
			{
				if (this.room[game_id].players[user_id].socket === socket_id)
					this.room[game_id].players[user_id].socket = "";
			}
		}
	}

	getOpponent(room_id: string, user_id_str: string): UserEntity[]
	{
		const room: LobbyI = this.room[room_id];
		var user_list: UserEntity[] = [];

		for (var player_id in room.players)
			if (player_id !== user_id_str)
				user_list.push(room.players[player_id]);
		return (user_list);
	}

	gameReconnect(socket: Socket, room_id: string)
	{
		const user_id_str = this.wsSocket.getUserId(socket.id).toString();
		var user: any = {};
		var is_started: boolean = false;

		for (var player_id in this.room[room_id].players)
		{
			if (player_id === user_id_str)
			{
				this.room[room_id].players[player_id].socket = socket.id;
				user = this.room[room_id].players[player_id].user; break;
			}
		}
		if (this.room[room_id].status === LobbyStatus.STARTED)
			socket.emit("gameReconnect", this.getOpponent(room_id, user_id_str));
		else
			socket.emit("gameWaiting");
	}

	async startGame(server: Server, room_id: string)
	{
		var room = this.room[room_id];

		if (room.state.gameStatus === GameStatus.FINISHED) {
			return;
		}
		this.room[room_id].state.gameStatus = GameStatus.STARTED;
		this.wsSocket.sendToUserInGame(server, this.room[room_id], "gameStarting", [room_id, this.room[room_id].state]);
		await sleep(3000);
		this.resetBall(server, this.room[room_id]);
		while (this.room[room_id].state.gameStatus === GameStatus.STARTED)
		{
			this.update(server, this.room[room_id]);
			await sleep(1000 / 128);
		}
		await sleep(5000);
		this.wsSocket.sendToUserInGame(server, room, "gameEnded", {});
	}

	// /************* Method called at each tick, updates the state *************/
	private update(server: Server, room: LobbyI) {
		room.state.serverUpdateTime = Date.now().toString();
		this.movePaddles(room);
		if (room.state.gameStatus === GameStatus.STARTED) {
			this.moveBall(room);
			this.checkCollisions(room);
			this.checkBallLose(server, room);
		}
		this.wsSocket.sendStatusToGame(server, room, room.state);
	}

	/************* Method called on 'move' ws message ***************/
	onMove(server: Server, socket: Socket, message: any) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room_id = this.getRoomIdBySocketId(socket.id);
		const player = this.getPlayerById(room_id, user_id);
		const message_direction = message[0];
		const message_type = message[1];
		const message_input_sequence_number = message[2];
		if (player) {
			if (message_type === "keydown" && player.paddle.keyReleased) {
				player.paddle.keyPressTime = Date.now();
				player.paddle.keyReleased = false;
				player.paddle.vx = this.determineMovement(message_direction);
			} else if (message_type === "keyup") {
				player.paddle.keyReleased = true;
				player.paddle.vx = 0;
			}
			player.lastProcessedInput = message_input_sequence_number;
		}
		this.wsSocket.sendStatusToGame(server, this.room[room_id], this.room[room_id].state);
	}

	/************** Game methods, called by update() ***************/
	private determineMovement(direction: string) {
		return direction === "left" ? -5 : 5;
	}

	private movePaddles(room: LobbyI) {
		room.state.players.forEach((player) => {
			if (!player.paddle.keyReleased) {
				player.paddle.x += player.paddle.vx;
				this.correctOverflow(player);
				player.paddle.vx *= 1.001;
			}
		});
	}

	private correctOverflow(player: PlayerI) {
		player.paddle.x = Math.min(Math.max(player.paddle.x, 0), 800);
	}

	private moveBall(room: LobbyI) {
		room.state.ball.x += room.state.ball.vx;
		room.state.ball.y += room.state.ball.vy;

		if (room.state.ball.x < 0 || room.state.ball.x > 800) {
			room.state.ball.vx *= -1;
		}
	}

	private checkCollisions(room: LobbyI) {
		room.state.players.forEach((player) => {
			const paddleLeftEdge = player.paddle.x - player.paddle.width / 2;
			const paddleRightEdge = player.paddle.x + player.paddle.width / 2;
			const paddleTopEdge = player.paddle.y - player.paddle.height / 2;
			const paddleBottomEdge = player.paddle.y + player.paddle.height / 2;

			const ballIsWithinXBounds =
				room.state.ball.x >= paddleLeftEdge &&
				room.state.ball.x <= paddleRightEdge;
			const ballIsWithinYBounds =
				room.state.ball.y >= paddleTopEdge &&
				room.state.ball.y <= paddleBottomEdge;

			if (ballIsWithinXBounds && ballIsWithinYBounds) {
				room.state.ball.vy *= -1;
				room.state.ball.vx +=
					(room.state.ball.x - player.paddle.x) / 10;
				room.state.ball.vy +=
					(room.state.ball.y - player.paddle.y) / 10;
			}
		});
	}

	private checkBallLose(server: Server, room: LobbyI) {
		if (room.state.ball.y > 800) {
			this.ballLose(server, room, this.getPlayerBySide(room, "bottom"));
		} else if (room.state.ball.y < 0) {
			this.ballLose(server, room, this.getPlayerBySide(room, "top"));
		}
	}

	private ballLose(server: Server, room: LobbyI, player: PlayerI | undefined) {
		if (player) {
			this.playerScoreUpdate(player);
			this.checkGameOver(room);
			this.resetBall(server, room);
		}
	}

	private playerScoreUpdate(player: PlayerI) {
		player.score += 1;
		// this.broadcast("ball_lost", player.id);
	}

	private checkGameOver(room: LobbyI) {
		room.state.players.forEach((player) => {
			if (player.score == 5) {
				room.state.gameStatus = GameStatus.FINISHED;
				// this.broadcast("game_win", player.id);
				sleep(5000);
			}
		});
	}

	private resetBall(server: Server, room: LobbyI) {
		// room.state.ball.vx = Math.random() * 10 - 5;
		room.state.ball.vx = 0;
		room.state.ball.vy = 2;
		room.state.ball.x = 400;
		room.state.ball.y = 300;
		console.log(room.state);
		this.wsSocket.sendStatusToGame(server, room, room.state);
	}

	/********** Helpers ***********/
	private getPlayerById(room_id: string, user_id: number) {
		return this.room[room_id].state.players.find((player) => player.id === user_id);
	}

	private getRoomIdBySocketId(socket_id: string)
	{
		for (var room_id in this.room)
			for (var user_id in this.room[room_id].players)
				if (this.room[room_id].players[user_id].socket === socket_id)
					return (room_id);
	}

	private getPlayerBySide(room: LobbyI, side_id: string) {
		return room.state.players.find((player) => player.side_id === side_id);
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

