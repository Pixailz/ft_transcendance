import { UserI } from "../user/user.interface"

export enum GameStatus {
	LOBBY,
	WAITING,
	STARTED,
	FINISHED,
	INTERRUPTED,
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
	vx					: number,
	keyPressTime		: number,
	color				: string,
	keyReleased			: boolean,
}

export const DefPaddleI: PaddleI = {
	width				: 100,
	height				: 20,
	x					: 400,
	y					: 0,
	vx					: 0,
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
	side_id				: "bottom",
	lastProcessedInput	: 0,
}

export interface GameStateI {
	players				: PlayerI[],
	ball				: BallI,
	serverUpdateTime	: number,
}

export const DefGameStateI: GameStateI = {
	players				: [],
	ball				: DefBallI,
	serverUpdateTime	: Date.now(),
}

export interface LobbyI {
	status			: number,
	id				: string,
	type			: string,
	players			: UserI[],
	state			: GameStateI,
	previousState	: GameStateI,
}

export const DefLobbyI: LobbyI = {
	status			: GameStatus.LOBBY,
	id				: "",
	type			: "",
	players			: [],
	state			: DefGameStateI,
	previousState	: DefGameStateI,
}


