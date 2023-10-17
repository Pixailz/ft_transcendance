import { UserI } from "../user/user.interface"

export enum GameStatus {
	LOBBY,
	WAITING,
	STARTED,
	FINISHED,
	INTERRUPTED,
}

export const Maps: MapI[] = [
	{name: "normal", thumbnail: "https://placehold.co/50"},
	{name: "rainbow4ever", thumbnail: "https://placehold.co/50"},
	{name: "hacker", thumbnail: "https://placehold.co/50"},
	{name: "xX_b3StM4PSn1P3r_Xx", thumbnail: "https://placehold.co/50"},
]

export interface MapI {
	name				: "normal" | "rainbow4ever" | "hacker" | "xX_b3StM4PSn1P3r_Xx",
	thumbnail			: string,
}

export interface GameOptionI {
	type				: "normal" | "custom",
	powerUps			: boolean,
	map					: MapI,
	is_private			: boolean,
}

export const DefGameOptionI : GameOptionI = {
	type				: "normal",
	powerUps			: false,
	map					: {name: "normal", thumbnail: "/assets/images/maps/normal.png"},
	is_private			: false,
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

export interface PowerUpI {
	x: number;
	y: number;
	type: "speed" | "size" | "sticky" | "death";
	duration: number;
	appliedAt?: number;
	appliedTo?: "left" | "right" | "ball";
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
	powerUps			: PowerUpI[],
}

export const DefGameStateI: GameStateI = {
	players				: [],
	ball				: DefBallI,
	serverUpdateTime	: Date.now(),
	powerUps			: [],
}

export interface LobbyI {
	status			: number,
	options			: GameOptionI,
	id				: string,
	type			: string,
	players			: UserI[],
	state			: GameStateI,
	previousState	: GameStateI,
}

export const DefLobbyI: LobbyI = {
	status			: GameStatus.LOBBY,
	options			: DefGameOptionI,
	id				: "",
	type			: "",
	players			: [],
	state			: DefGameStateI,
	previousState	: DefGameStateI,
}


