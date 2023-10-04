import { UserEntity } from "src/modules/database/user/entity"

export enum GameStatus {
	LOBBY,
	WAITING,
	STARTED,
	FINISHED,
	INTERRUPTED,
}

export enum LobbyStatus {
	LOBBY,
	WAITING,
	STARTED,
}


export interface GameOptionI {
	type				: string,
}

export const DefGameOptionI : GameOptionI = {
	type				: "normal",
}

export interface CanvasI {
	width				: number,
	height				: number,
}

export const DefCanvasI: CanvasI = {
	width				: 0,
	height				: 0,
}

export interface BallI {
	x					: number,
	y					: number,
	vx					: number,
	vy					: number,
}

export const DefBallI: BallI = {
	x					: 400,
	y					: 300,
	vx					: 0,
	vy					: 0,
}

export interface PaddleI {
	width				: number,
	height				: number,
	x					: number,
	y					: number,
	vy					: number,
	keyPressTime		: number,
	color				: string,
	keyReleased			: boolean,
}

export const DefPaddleI: PaddleI = {
	width				: 100,
	height				: 20,
	x					: 400,
	y					: 0,
	vy					: 0,
	keyPressTime		: 0,
	color				: "",
	keyReleased			: true,
}

export interface PlayerI {
	id					: number,
	score				: number,
	canvas				: CanvasI,
	paddle				: PaddleI,
	side_id				: string,
	lastProcessedInput	: number,
}

export const DefPlayerI: PlayerI = {
	id					: -1,
	score				: 0,
	canvas				: DefCanvasI,
	paddle				: DefPaddleI,
	side_id				: "",
	lastProcessedInput	: 0,
}

export interface GameStateI {
	gameStatus			: GameStatus,
	players				: PlayerI[],
	ball				: BallI,
	serverUpdateTime	: string,
}

export const DefGameStateI: GameStateI = {
	gameStatus			: GameStatus.WAITING,
	players				: [],
	ball				: DefBallI,
	serverUpdateTime	: Date.now().toString(),
}


export interface PlayerSockI {
	user				: any,
	socket				: string,
}

export const DefPlayerSockI: PlayerSockI = {
	user				: {
		id				: -1,
	},
	socket				: "",
}

export interface LobbyI {
	status			: LobbyStatus,
	type			: string,
	players			: PlayerSockI[],
	state			: GameStateI,
	previousState	: GameStateI,
	winner_id		: number,
}

export const DefLobbyI: LobbyI = {
	status			: LobbyStatus.LOBBY,
	type			: "",
	players			: [],
	state			: DefGameStateI,
	previousState	: DefGameStateI,
	winner_id		: -1,
}
