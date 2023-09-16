import { DefUserI, UserI } from "../user.interface"

export interface GameOptionI {
	type				: string,
}

export const DefGameOptionI : GameOptionI = {
	type				: "normal",
}

export interface Pos {
	x				: number,
	y				: number,
}

export const DefPos: Pos = {
	x				: 0,
	y				: 0,
}

export interface Player {
	user			: UserI,
	pos				: Pos,
}

export const DefPlayer: Player = {
	user			: DefUserI,
	pos				: DefPos,
}

export enum GameStatus {
	LOBBY,
	WAITING,
	STARTED,
}

export interface LobbyI {
	status			: number,
	id				: string,
	type			: string,
	opponent		: Player
}

export const DefLobbyI: LobbyI = {
	status			: GameStatus.LOBBY,
	id				: "",
	type			: "",
	opponent		: DefPlayer,
}
