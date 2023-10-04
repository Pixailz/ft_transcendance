import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { WSSocket } from "../socket.service";
import { randomBytes } from "crypto";
import { UserService } from "src/adapter/user/service";
import { Sanitize } from "../../modules/database/sanitize-object";
import {
	DefPaddleI,
	DefPlayerI,
	GameStatus,
	LobbyStatus,
	LobbyI,
	PlayerI,
	PlayerSockI,
} from "./game.interface";
import { UserEntity } from "src/modules/database/user/entity";
import { DBGameInfoService } from "src/modules/database/game/gameInfo/service";
import { GameInfoEntity } from "src/modules/database/game/gameInfo/entity";
import { DBPlayerScoreService } from "src/modules/database/game/player-score/service";

@Injectable()
export class WSGameService {
	rooms: Map<string, LobbyI>;

	constructor(
		private sanitize: Sanitize,
		private userService: UserService,
		private wsSocket: WSSocket,
		private gameDBService: DBGameInfoService,
		private scoreDBService: DBPlayerScoreService,
	) {
		this.rooms = new Map();
	}

	getInfo() {
		for (const [room_id, room] of this.rooms) {
			console.log("room_id ", room_id);
			console.log(room);
		}
	}

	async gameSearch(server: Server, socket: Socket, game_opt: any) {
		const player: PlayerSockI = {
			user: this.sanitize.User(
				await this.userService.getInfoById(
					this.wsSocket.getUserId(socket.id),
				),
			),
			socket: socket.id,
		};
		const room_id = this.gameSearchOpponent(player, game_opt, socket);
		const room = this.rooms.get(room_id);
		if (this.isFullRoom(room) && room.status !== LobbyStatus.STARTED)
			this.startGame(server, room_id);
		else if (room.status === LobbyStatus.LOBBY) socket.emit("gameWaiting");
	}

	gameSearchOpponent(player: PlayerSockI, game_opt: any, socket: Socket) {
		const room_id = this.gameSearchRoom(player, game_opt);

		if (room_id !== "") {
			this.addPlayerToRoom(player, room_id, socket);
		} else {
			return this.createRoom(player, game_opt, socket);
		}
		return room_id;
	}

	gameSearchRoom(player: PlayerSockI, game_opt: any): string {
		for (const [room_id, room] of this.rooms) {
			if (this.isInRoom(player, room)) return room_id; //we first loop to check if the player is already in a room
		}
		for (const [room_id, room] of this.rooms) {
			if (room.type === game_opt.type && !this.isFullRoom(room))
				return room_id; //then we loop to find a room with the same game type and not full
		}
		return "";
	}

	isInRoom(player: PlayerSockI, room: LobbyI): boolean {
		for (const player_id in room.players)
			if (room.players[player_id].user.id === player.user.id) return true;
		return false;
	}

	isFullRoom(room: LobbyI): boolean {
		let max_player = 0;
		let nb_player = 0;
		switch (room.type) {
			case "normal":
				max_player = 2;
				break;
		}
		for (const friend_id in room.players) nb_player++;
		return nb_player >= max_player;
	}

	addPlayerToRoom(player_sock: PlayerSockI, room_id: string, socket: Socket) {
		const current_lobby: LobbyI = this.rooms.get(room_id);
		for (const player_id in current_lobby.players) {
			if (
				current_lobby.players[player_id].user.id === player_sock.user.id
			) {
				current_lobby.players[player_id].socket = player_sock.socket;
				socket.emit(
					"gameReconnect",
					// this.getOpponent(room_id, user_id_str),
					current_lobby.state,
				);
				return;
			}
		}

		if (!current_lobby.state.players) current_lobby.state.players = [];
		if (!current_lobby.players) current_lobby.players = [];
		current_lobby.players.push(player_sock);
		const side_id = this.isFullRoom(current_lobby) ? "right" : "left";
		const player = Object.assign({}, DefPlayerI);
		player.id = player_sock.user.id;
		player.side_id = side_id;
		player.paddle = Object.assign({}, DefPaddleI);
		player.paddle.x = side_id === "right" ? 750 : 50;
		player.paddle.color = side_id === "right" ? "red" : "green";
		player.paddle.width = 20;
		player.paddle.height = 75;
		current_lobby.state.players.push(player);
	}

	createRoom(player: PlayerSockI, game_opt: any, socket: Socket) {
		let room_id = `${this.getUidPart(8)}-`;

		for (let i = 0; i < 4; i++) room_id += `${this.getUidPart(4)}-`;
		room_id += this.getUidPart(8);

		this.rooms.set(room_id, {
			status: LobbyStatus.LOBBY,
			type: "",
			winner_id: -1,
			state: {
				gameStatus: GameStatus.WAITING,
				players: [],
				ball: {
					x: 400,
					y: 300,
					vx: 0,
					vy: 0,
				},
				serverUpdateTime: Date.now().toString(),
			},
			previousState: {
				gameStatus: GameStatus.WAITING,
				players: [],
				ball: {
					x: 400,
					y: 300,
					vx: 0,
					vy: 0,
				},
				serverUpdateTime: Date.now().toString(),
			},
			players: [],
		} as LobbyI);
		this.rooms.get(room_id).type = game_opt.type;

		this.addPlayerToRoom(player, room_id, socket);
		return room_id;
	}

	getUidPart(size: number) {
		return randomBytes(size).toString("hex");
	}

	isInGame(server: Server, socket: Socket) {
		// const user_id_str = this.wsSocket.getUserId(socket.id).toString();
		// let isInGame = false;
		// for (let room_id in this.rooms) {
		// 	const room = this.rooms.get(room_id);
		// 	for (const player_id in room.players) {
		// 		if (player_id === user_id_str) {
		// 			isInGame = true;
		// 			break;
		// 		}
		// 	}
		// }
		// if (isInGame) server.to(socket.id).emit("isInGame", room_id);
	}

	disconnect(socket_id: string) {
		for (const [roomid, room] of this.rooms) {
			for (const player_id in room.players) {
				if (room.players[player_id].socket === socket_id) {
					room.players[player_id].socket = "";
					break;
				}
			}
		}
	}

	getOpponent(room_id: string, user_id_str: string): UserEntity[] {
		const room: LobbyI = this.rooms.get(room_id);
		const user_list: UserEntity[] = [];

		for (const player_id in room.players)
			if (player_id !== user_id_str)
				user_list.push(room.players[player_id].user);
		return user_list;
	}

	gameReconnect(socket: Socket, room_id: string) {
		const user_id_str = this.wsSocket.getUserId(socket.id).toString();
		const room = this.rooms.get(room_id);

		for (const player_id in room.players) {
			if (player_id === user_id_str) {
				room.players[player_id].socket = socket.id;
				break;
			}
		}
		if (room.status === LobbyStatus.STARTED)
			socket.emit(
				"gameReconnect",
				// this.getOpponent(room_id, user_id_str),
				room.state,
			);
		else socket.emit("gameWaiting");
	}

	async startGame(server: Server, room_id: string) {
		const room = this.rooms.get(room_id);

		if (room.state.gameStatus === GameStatus.FINISHED) {
			return;
		}
		this.gameDBService
			.create({
				type: room.type,
				users: room.players.map((player) => player.user.id),
			})
			.then((gameInfo: GameInfoEntity) => {
				room.db_room_id = gameInfo.id;
			})
			.catch((err) => {
				console.error(err);
				this.wsSocket.sendToUserInGame(server, room, "gameEnded", {});
				return;
			});

		room.status = LobbyStatus.STARTED;
		room.state.gameStatus = GameStatus.STARTED;
		this.wsSocket.sendToUserInGame(server, room, "gameStarting", [
			room_id,
			room.state,
		]);
		// await sleep(3000);
		await sleep(500);
		this.resetBall(server, room);
		while (room.state.gameStatus === GameStatus.STARTED) {
			this.update(server, room);
			await sleep(1000 / 64);
		}
		// await sleep(5000);
		await sleep(1000);
		console.log(await this.gameDBService.returnOne(room.db_room_id));
		this.wsSocket.sendToUserInGame(server, room, "gameEnded", {});
		Object.getOwnPropertyNames(this.rooms.get(room_id)).forEach((value) => {
			delete this.rooms.get(room_id)[value];
		});
		this.rooms.delete(room_id);
		console.log("GAME ENDED");
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
		this.wsSocket.sendStatusToGame(server, room);
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
				player.paddle.vy = this.determineMovement(message_direction);
			} else if (message_type === "keyup") {
				player.paddle.keyReleased = true;
				player.paddle.vy = 0;
			}
			player.lastProcessedInput = message_input_sequence_number;
		}
		this.wsSocket.sendStatusToGame(server, this.rooms.get(room_id));
	}

	/************** Game methods, called by update() ***************/
	private determineMovement(direction: string) {
		return direction === "bottom" ? 5 : -5;
	}

	private movePaddles(room: LobbyI) {
		room.state.players.forEach((player) => {
			// if (player.paddle.keyReleased) {
			// 	const duration = (Date.now() - player.paddle.keyPressTime) / 1000;
			// 	const easingFactor = 0.1;
			// 	player.paddle.vy += easingFactor * -player.paddle.vy * duration;
			// } else
			if (!player.paddle.keyReleased) {
				player.paddle.y += player.paddle.vy;
				this.correctOverflow(player);
				player.paddle.vy *= 1.01;
			}
		});
	}

	private correctOverflow(player: PlayerI) {
		player.paddle.y = Math.min(Math.max(player.paddle.y, 0), 600);
	}

	private moveBall(room: LobbyI) {
		room.state.ball.x += room.state.ball.vx;
		room.state.ball.y += room.state.ball.vy;

		if (room.state.ball.y < 0 || room.state.ball.y > 600) {
			room.state.ball.vy *= -1;
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
				room.state.ball.vx *= -1;
				room.state.ball.vx +=
					(room.state.ball.x - player.paddle.x) / 10;
				room.state.ball.vy +=
					(room.state.ball.y - player.paddle.y) / 10;
			}
		});
	}

	private checkBallLose(server: Server, room: LobbyI) {
		if (room.state.ball.x > 800) {
			this.ballWon(server, room, this.getPlayerBySide(room, "left"));
		} else if (room.state.ball.x < 0) {
			this.ballWon(server, room, this.getPlayerBySide(room, "right"));
		}
	}

	private ballWon(server: Server, room: LobbyI, player: PlayerI | undefined) {
		if (player) {
			this.playerScoreUpdate(player, room);
			this.checkGameOver(room);
			this.resetBall(server, room);
		}
	}

	private playerScoreUpdate(player: PlayerI, room: LobbyI) {
		player.score += 1;
		this.scoreDBService
			.update(room.db_room_id, {
				playerId: player.id,
				score: player.score,
			})
			.then(async (score) => {
				console.log("playerScore updated, new scores: ");
				console.log(
					await this.scoreDBService.find({
						where: { gameInfo: { id: room.db_room_id } },
					}),
				);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	private checkGameOver(room: LobbyI) {
		room.state.players.forEach((player) => {
			if (player.score == 5) {
				room.state.gameStatus = GameStatus.FINISHED;
			}
		});
	}

	private resetBall(server: Server, room: LobbyI) {
		// room.state.ball.vx = -3;
		room.state.ball.vx = 3;
		room.state.ball.vy = Math.random() * 2 - 1;
		room.state.ball.x = 400;
		room.state.ball.y = 300;
		this.wsSocket.sendStatusToGame(server, room);
	}

	/********** Helpers ***********/
	private getPlayerById(room_id: string, user_id: number) {
		const room = this.rooms.get(room_id);
		return room.state.players.find((player) => player.id === user_id);
	}

	private getRoomIdBySocketId(socket_id: string) {
		for (const [room_id, room] of this.rooms) {
			for (const user_id in room.players)
				if (room.players[user_id].socket === socket_id) return room_id;
		}
	}

	private getPlayerBySide(room: LobbyI, side_id: string) {
		return room.state.players.find((player) => player.side_id === side_id);
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
