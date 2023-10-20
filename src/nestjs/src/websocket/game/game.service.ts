import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { WSSocket } from "../socket.service";
import { randomBytes } from "crypto";
import { UserService } from "../../adapter/user/service";
import { Sanitize } from "../../modules/database/sanitize-object";
import {
	DefPaddleI,
	DefPlayerI,
	GameStatus,
	LobbyStatus,
	LobbyI,
	PlayerI,
	PlayerSockI,
	GameOptionI,
	PowerUpI,
} from "./game.interface";
import { Status, UserEntity } from "../../modules/database/user/entity";
import { DBGameInfoService } from "../../modules/database/game/gameInfo/service";
import { GameInfoEntity } from "../../modules/database/game/gameInfo/entity";
import { DBPlayerScoreService } from "../../modules/database/game/playerScore/service";
import { UserMetricsService } from "../../modules/database/metrics/service";

export enum powerUpMercyFlags {
	GIVE_THEM_A_CHANCE = 0,
	KILL_THEM_ALL = 1,
}

@Injectable()
export class WSGameService {
	rooms: Map<string, LobbyI>;

	constructor(
		private sanitize: Sanitize,
		private userService: UserService,
		private wsSocket: WSSocket,
		private gameDBService: DBGameInfoService,
		private scoreDBService: DBPlayerScoreService,
		private metricsService: UserMetricsService,
	) {
		this.rooms = new Map();
	}

	getInfo() {
		for (const [room_id, room] of this.rooms) {
			console.log("room_id ", room_id);
			console.log(room);
		}
	}

	async gameJoin(server: Server, socket: Socket, room_id: string) {
		const player: PlayerSockI = {
			user: this.sanitize.User(
				await this.userService.getInfoById(
					this.wsSocket.getUserId(socket.id),
				),
			),
			socket: socket.id,
		};
		const room = this.rooms.get(room_id);
		if (room) {
			this.addPlayerToRoom(server, player, room_id, socket);
			if (this.isFullRoom(room)) this.startGame(server, room_id);
			else socket.emit("gameWaiting", room_id);
		}
	}

	async gameSearch(server: Server, socket: Socket, game_opt: GameOptionI) {
		const player: PlayerSockI = {
			user: this.sanitize.User(
				await this.userService.getInfoById(
					this.wsSocket.getUserId(socket.id),
				),
			),
			socket: socket.id,
		};
		const room_id = this.gameSearchOpponent(server, player, game_opt, socket);
		const room = this.rooms.get(room_id);
		if (this.isFullRoom(room) && room.status !== LobbyStatus.STARTED)
			this.startGame(server, room_id);
		else if (room.status === LobbyStatus.LOBBY)
			socket.emit("gameWaiting", room_id);
	}

	gameSearchOpponent(
		server: Server,
		player: PlayerSockI,
		game_opt: any,
		socket: Socket
	) {
		const room_id = this.gameSearchRoom(player, game_opt);

		if (room_id !== "" && !game_opt.is_private) {
			this.addPlayerToRoom(server, player, room_id, socket);
		} else {
			return this.createRoom(server, player, game_opt, socket);
		}
		return room_id;
	}

	gameSearchRoom(player: PlayerSockI, game_opt: any): string {
		for (const [room_id, room] of this.rooms) {
			if (this.isInRoom(player, room)) return room_id; //we first loop to check if the player is already in a room
		}
		for (const [room_id, room] of this.rooms) {
			if (room.options.powerUps === game_opt.powerUps &&
				room.options.maps.name === game_opt.maps.name &&
				!room.options.is_private && !this.isFullRoom(room))
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
		let max_player = 2;
		let nb_player = 0;
		// switch (room.options.type) {
		// 	case "normal":
		// 	case "custom":
		// 		max_player = 2;
		// 		break;
		// }
		for (const friend_id in room.players) nb_player++;
		return nb_player >= max_player;
	}

	addPlayerToRoom(
		server: Server,
		player_sock: PlayerSockI,
		room_id: string,
		socket: Socket
	) {
		const current_lobby: LobbyI = this.rooms.get(room_id);
		for (const player_id in current_lobby.players) {
			if (
				current_lobby.players[player_id].user.id === player_sock.user.id
			) {
				current_lobby.players[player_id].socket = player_sock.socket;
				this.setStatusUserInRoom(server, current_lobby, Status.INGAME);
				socket.emit(
					"gameReconnect",
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

	createRoom(
		server: Server,
		player: PlayerSockI,
		game_opt: GameOptionI,
		socket: Socket
	) {
		let room_id = `${this.getUidPart(8)}-`;

		for (let i = 0; i < 4; i++) room_id += `${this.getUidPart(4)}-`;
		room_id += this.getUidPart(8);

		this.rooms.set(room_id, {
			status: LobbyStatus.LOBBY,
			options: {
				type: "normal",
				powerUps: game_opt.powerUps,
				maps: game_opt.maps,
				is_private: game_opt.is_private,
			},
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
		this.addPlayerToRoom(server, player, room_id, socket);
		return room_id;
	}

	getUidPart(size: number) {
		return randomBytes(size).toString("hex");
	}

	isInGame(server: Server, socket: Socket) {
		const user_id = this.wsSocket.getUserId(socket.id);
		let isInGame = false;
		for (const [roomid, room] of this.rooms) {
			for (const player_id in room.players) {
				if (room.players[player_id].user.id === user_id) {
					isInGame = true;
					break;
				}
			}
		}
		if (isInGame) server.to(socket.id).emit("isInGame");
	}

	disconnect(socket_id: string) {
		for (const [roomid, room] of this.rooms) {
			for (const player_id in room.players) {
				if (room.players[player_id].socket === socket_id) {
					room.players[player_id].socket = "";
					break;
				}
			}
			if (
				room.players.find((player) => player.socket !== "") ===
				undefined //if we don't find any player with a socket, then the room is empty
			) {
				if (room.status === LobbyStatus.STARTED) {
					room.status = LobbyStatus.LOBBY;
					console.log("Ending game of room: ", roomid);
					return; //game should be ended by the main loop
				}
				this.rooms.delete(roomid);
				console.log("Garbage Collected room: ", roomid);
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

	async setStatusUserInRoom(server: Server, room: LobbyI, status: Status)
	{
		for (var i in room.players)
		{
			await this.userService.setStatus(room.players[i].user.id, status);
			const friends = await this.userService.getAllFriend(room.players[i].user.id);
			this.wsSocket.sendToUsersInfo(server, friends, "getNewStatusFriend", {
				user_id: room.players[i].user.id,
				status: status,
			});
		}
	}

	async startGame(server: Server, room_id: string) {
		const room = this.rooms.get(room_id);

		this.setStatusUserInRoom(server, room, Status.INGAME);
		if (!this.canStartGame(room)) return;

		try {
			await this.createGameDB(room);
		} catch (err) {
			console.error(err);
			this.wsSocket.sendToUserInGame(server, room, "gameEnded", {});
			return;
		}

		this.startGameInRoom(server, room, room_id); //send the game initial state to the players
		await sleep(500, room_id); //wait for the client to setup the game

		this.resetBall(server, room); //set the ball position for first serve

		/**	Main game loop
		 * 	- update the game state at 64Hz
		 *  - can be stopped by:
		 * 		- all players disconnecting (handled by disconnect())
		 * 		- a player winning (handled by checkGameOver())
		 *  - when stopped, the game is ended, winner determined and elo updated
		 */
		await this.mainLoop(server, room, room_id);

		await sleep(1000, room_id); //game ended, wait a bit before kicking the players
		this.wsSocket.sendToUserInGame(server, room, "gameEnded", {});

		/** Data Race here:
		 * 	- the game is ended, client is kicked, but gameroom is still in memory
		 *  - if a player saves the room_id and reconnects before the game is garbage
		 * 	collected, he will probably be able to reconnect and the comportement
		 *  will be undefined, as i can not test it
		 *  - maybe putting the room in a queue of ended games and garbage collecting
		 *  it after a while would be a good idea
		 */
		await this.determineWinnerAndUpdateElo(room); // data race
		await this.launchMetricsUpdate(room); // data race

		this.rooms.delete(room_id);
		/* End of data race here:
		 * - room is now garbage collected. if player tries to reconnect,
		 * it will be handled by gameJoin() which wont be able to find the room
		 * and thus will do nothing
		 */
		this.setStatusUserInRoom(server, room, Status.CONNECTED);
		console.log("game ended");
	}

	private async mainLoop(server: Server, room: LobbyI, room_id: string) {
		while (room.status === LobbyStatus.STARTED) {
			this.update(server, room);
			await sleep(1000 / 64, room_id);
		}
		console.log("quitting main loop");
		clearSleeps(room_id);
	}

	private canStartGame(room: LobbyI) {
		return (
			room.state.gameStatus !== GameStatus.FINISHED &&
			this.isFullRoom(room)
		);
	}

	private async createGameDB(room: LobbyI) {
		const gameInfo: GameInfoEntity = await this.gameDBService.create({
			type: room.options.type,
			users: room.players.map((player) => player.user.id),
		});
		room.db_room_id = gameInfo.id;
	}

	private startGameInRoom(server: Server, room: LobbyI, room_id: string) {
		room.status = LobbyStatus.STARTED;
		room.state.gameStatus = GameStatus.STARTED;
		this.wsSocket.sendToUserInGame(server, room, "gameStarting", [
			room_id,
			room.state,
			"3",
		]);
	}

	private async determineWinnerAndUpdateElo(room: LobbyI) {
		const winner = this.checkWinner(room.state.players);
		if (winner !== null) {
			room.winner_id = winner.id;
			await this.gameDBService.update(room.db_room_id, {
				winnerId: room.winner_id,
			});
			await this.userService.updateElo(
				room.players[0].user.id,
				room.players[1].user.id,
				room.winner_id,
			);
		}
	}

	private async launchMetricsUpdate(room: LobbyI) {
		for (const player of room.players) {
			await this.metricsService.updateMetrics(player.user);
		}
	}

	private checkWinner(players: PlayerI[]): PlayerI {
		if (players[0].score > players[1].score) return players[0];
		else if (players[0].score < players[1].score) return players[1];
		else return null;
	}

	// /************* Method called at each tick, updates the state *************/
	private update(server: Server, room: LobbyI) {
		room.state.serverUpdateTime = Date.now().toString();
		this.movePaddles(room);
		if (room.state.gameStatus === GameStatus.STARTED) {
			this.moveBall(room);
			this.checkCollisions(room);
			this.checkBallLose(server, room);
			if (room.options.powerUps) {
				this.powerUpsNurcery(room);
			}
		}
		this.wsSocket.sendStatusToGame(server, room);
	}

	/************* Method called on 'move' ws message ***************/
	onMove(server: Server, socket: Socket, message: any) {
		const user_id = this.wsSocket.getUserId(socket.id);
		const room_id = this.getRoomIdBySocketId(socket.id);
		if (!room_id) return;
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
	private powerUpsNurcery(room: LobbyI) {
		if (!room.state.powerUps) room.state.powerUps = [];
		this.maybeGiveBirthToPowerUp(room);
		this.watchPowerUpsGrowUp(room);
		this.maybeKillPowerUps(room, powerUpMercyFlags.GIVE_THEM_A_CHANCE); //they've probably been bad boys, we dont know
	}

	private maybeGiveBirthToPowerUp(room: LobbyI) {
		//generate a PowerUp every 6-9s
		const isPregnant =
			Math.random() > 0.993 &&
			room.state.powerUps.length < 4 &&
			room.state.gameStatus === GameStatus.STARTED &&
			Date.now() - room.state.ball.lastHit > 1000;
		if (isPregnant) {
			let type;
			const prob = Math.floor(Math.random() * 4);
			switch (prob) {
				default:
				case 0:
					if (
						room.state.powerUps.find(
							(powerup) => powerup.type == "speed",
						)
					)
						return;
					type = "speed";
					break;
				case 1:
					if (
						room.state.powerUps.find(
							(powerup) => powerup.type == "size",
						)
					)
						return;
					type = "size";
					break;
				case 2:
					if (
						room.state.powerUps.find(
							(powerup) => powerup.type == "sticky",
						)
					)
						return;
					type = "sticky";
					break;
				case 3:
					if (
						room.state.powerUps.find(
							(powerup) => powerup.type == "death",
						)
					)
						return;
					type = "death";
					break;
			}
			const powerUp = {
				x: Math.random() * 700 + 50,
				y: Math.random() * 500 + 50,
				type: type,
				// duration between 4 and 8s
				duration: Math.random() * 4 + 4,
				appliedAt: null,
				appliedTo: null,
			};
			room.state.powerUps.push(powerUp);
			console.log("new powerUp: ", powerUp);
		}
	}

	private watchPowerUpsGrowUp(room: LobbyI) {
		room.state.powerUps.forEach((powerUp) => {
			if (powerUp.appliedAt) return; //he's already got a job
			const ballCenter = { x: room.state.ball.x, y: room.state.ball.y };
			const powerUpCenter = { x: powerUp.x, y: powerUp.y };
			const distance = Math.abs(
				Math.sqrt(
					Math.pow(ballCenter.x - powerUpCenter.x, 2) +
						Math.pow(ballCenter.y - powerUpCenter.y, 2),
				),
			);
			if (distance < 30) {
				this.watchPowerUpGettingAJob(room, powerUp); //he's sooooo cute he's getting a job
			}
		});
	}

	private watchPowerUpGettingAJob(room: LobbyI, powerUp: PowerUpI) {
		const playerSide = room.state.ball.vx > 0 ? "left" : "right";
		const player = this.getPlayerBySide(room, playerSide);
		switch (powerUp.type) {
			case "speed":
				room.state.ball.vx *= 2;
				room.state.ball.vy *= 2;
				powerUp.appliedTo = "ball";
				break;
			case "size":
				player.paddle.height *= 2;
				powerUp.appliedTo = playerSide;
				break;
			case "sticky":
				room.state.ball.vx = 0;
				room.state.ball.vy = 0;
				powerUp.appliedTo = "ball";
				break;
			case "death":
				player.paddle.height = 15;
				powerUp.appliedTo = playerSide;
				break;
		}
		powerUp.appliedAt = Date.now();
		console.log("This little boy just get a job ", powerUp);
	}

	private maybeKillPowerUps(room: LobbyI, cleanFlag: powerUpMercyFlags) {
		room.state.powerUps?.forEach((powerUp, index) => {
			if (
				cleanFlag === powerUpMercyFlags.KILL_THEM_ALL ||
				(powerUp.appliedAt &&
					Date.now() - powerUp.appliedAt > powerUp.duration * 1000)
			) {
				this.killPowerUp(room, powerUp); // we found a bad boy
				room.state.powerUps.splice(index, 1);
			}
		});
	}

	private killPowerUp(room: LobbyI, powerUp: PowerUpI) {
		let player;
		switch (powerUp.type) {
			case "speed":
				if (!powerUp.appliedTo) break;
				room.state.ball.vx /= 2;
				room.state.ball.vy /= 2;
				break;
			case "size":
				if (!powerUp.appliedTo) break;
				player = this.getPlayerBySide(room, powerUp.appliedTo);
				player.paddle.height /= 2;
				break;
			case "sticky":
				room.state.ball.vx = Math.random() * 10 - 1;
				room.state.ball.vy = Math.random() * 2 - 1;
				break;
			case "death":
				// if no one has scored yet, then he's saved by the bell
				// otherwise he has lost ball, died, and powerup is removed
				if (!powerUp.appliedTo) break;
				player = this.getPlayerBySide(room, powerUp.appliedTo);
				player.paddle.height = 75;
				break;
			default:
				break;
		}
	}

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
				room.state.ball.lastHit = Date.now();
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
			this.maybeKillPowerUps(room, powerUpMercyFlags.KILL_THEM_ALL);
			room.state.ball.lastHit = Date.now();
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
			.catch((err) => {
				console.error(err);
			});
	}

	private checkGameOver(room: LobbyI) {
		room.state.players.forEach(async (player) => {
			if (player.score == 5) {
				room.status = LobbyStatus.LOBBY;
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
		return room.state?.players.find((player) => player.id === user_id);
	}

	private getRoomIdBySocketId(socket_id: string) {
		for (const [room_id, room] of this.rooms) {
			for (const user_id in room.players)
				if (room.players[user_id].socket === socket_id) return room_id;
		}
	}

	private getPlayerBySide(room: LobbyI, side_id: string) {
		return room.state?.players.find((player) => player.side_id === side_id);
	}
}

const timeouts = new Map<string, NodeJS.Timeout[]>();

const sleep = (ms: number, roomid: string) =>
	new Promise((resolve) => {
		const r = setTimeout(resolve, ms);
		if (!timeouts.has(roomid)) timeouts.set(roomid, []);
		timeouts.get(roomid).push(r);
	});

const clearSleeps = (roomid: string) => {
	if (timeouts.has(roomid)) {
		timeouts.get(roomid).forEach((timeout) => clearTimeout(timeout));
		timeouts.delete(roomid);
	}
};
