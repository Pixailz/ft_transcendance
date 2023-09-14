import { MapSchema, Schema, Context, type } from "@colyseus/schema";

export enum GameRoomStatus {
	WAITING = 0,
	STARTING,
	STARTED,
	FINISHED,
	INTERRUPTED,
}

class Canvas extends Schema {
	@type("int32") width = 0;
	@type("int32") height = 0;
}

class Ball extends Schema {
	@type("float32") x = 400;
	@type("float32") y = 300;
	@type("float32") vx = 0;
	@type("float32") vy = 4;
}

class Paddle extends Schema {
	@type("int32") width = 100;
	@type("int32") height = 0;
	@type("int32") x = 0;
	@type("int32") y = 0;
	@type("string") color = "";
}

class Player extends Schema {
	@type("string") public id = "";
	@type("int32") public score = 0;
	@type(Canvas) public canvas: Canvas = new Canvas();
	@type(Paddle) public paddle: Paddle = new Paddle();
	@type("string") public side: "top" | "bottom";
}

export class GameRoomState extends Schema {
	@type("int8") public gameStatus = GameRoomStatus["WAITING"];

	@type({ map: Player }) public players = new MapSchema<Player>();

	@type(Ball) public ball: Ball;

	constructor() {
		super();
	}
}