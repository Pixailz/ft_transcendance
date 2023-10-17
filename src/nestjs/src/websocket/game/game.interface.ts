import { GameInfoEntity } from "src/modules/database/game/gameInfo/entity";
import { UserEntity } from "src/modules/database/user/entity";

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

export const Maps: MapI[] = [
	{ name: "normal", thumbnail: "https://placehold.co/50" },
	{ name: "rainbow4ever", thumbnail: "https://placehold.co/50" },
	{ name: "hacker", thumbnail: "https://placehold.co/50" },
	{ name: "xX_b3StM4PSn1P3r_Xx", thumbnail: "https://placehold.co/50" },
];

export interface MapI {
	name: "normal" | "rainbow4ever" | "hacker" | "xX_b3StM4PSn1P3r_Xx";
	thumbnail: string;
}

export interface GameOptionI {
	type: "normal" | "custom";
	powerUps: boolean;
	maps: MapI;
	is_private: boolean;
}

export const DefGameOptionI: GameOptionI = {
	type: "normal",
	powerUps: false,
	maps: { name: "normal", thumbnail: "/assets/images/maps/normal.png" },
	is_private: false,
};

export interface CanvasI {
	width: number;
	height: number;
}

export const DefCanvasI: CanvasI = {
	width: 0,
	height: 0,
};

export interface BallI {
	x: number;
	y: number;
	vx: number;
	vy: number;
	lastHit: number;
}

export const DefBallI: BallI = {
	x: 400,
	y: 300,
	vx: 0,
	vy: 0,
	lastHit: -1,
};

export interface PaddleI {
	width: number;
	height: number;
	x: number;
	y: number;
	vy: number;
	keyPressTime: number;
	color: string;
	keyReleased: boolean;
}

export const DefPaddleI: PaddleI = {
	width: 100,
	height: 20,
	x: 400,
	y: 0,
	vy: 0,
	keyPressTime: 0,
	color: "",
	keyReleased: true,
};

export interface PowerUpI {
	x: number;
	y: number;
	type: "speed" | "size" | "sticky" | "death";
	duration: number;
	appliedAt?: number;
	appliedTo?: "left" | "right" | "ball";
}

export interface PlayerI {
	id: number;
	score: number;
	canvas: CanvasI;
	paddle: PaddleI;
	side_id: string;
	lastProcessedInput: number;
}

export const DefPlayerI: PlayerI = {
	id: -1,
	score: 0,
	canvas: DefCanvasI,
	paddle: DefPaddleI,
	side_id: "",
	lastProcessedInput: 0,
};

export interface GameStateI {
	gameStatus: GameStatus;
	players: PlayerI[];
	ball: BallI;
	serverUpdateTime: string;
	powerUps: PowerUpI[];
}

export const DefGameStateI: GameStateI = {
	gameStatus: GameStatus.WAITING,
	players: [],
	ball: DefBallI,
	serverUpdateTime: Date.now().toString(),
	powerUps: []
};

export interface PlayerSockI {
	user: any;
	socket: string;
}

export const DefPlayerSockI: PlayerSockI = {
	user: {
		id: -1,
	},
	socket: "",
};

export interface LobbyI {
	status: LobbyStatus;
	options: GameOptionI;
	players: PlayerSockI[];
	state: GameStateI;
	previousState: GameStateI;
	winner_id: number;
	db_room_id: number;
}

export const DefLobbyI: LobbyI = {
	status: LobbyStatus.LOBBY,
	options: DefGameOptionI,
	players: [],
	state: DefGameStateI,
	previousState: DefGameStateI,
	winner_id: -1,
	db_room_id: -1,
};
