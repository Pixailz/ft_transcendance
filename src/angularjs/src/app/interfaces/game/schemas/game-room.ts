import { ArraySchema, Schema, Context, type } from "@colyseus/schema";

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
	@type("float32") vy = 0;
}

class Paddle extends Schema {
	@type("int32") width = 100;
	@type("int32") height = 20;
	@type("int32") x = 400;
	@type("int32") y = 0;
	@type("float32") vx = 0;
	@type("float32") keyPressTime = 0;
	@type("string") color = "";
	@type("boolean") keyReleased = true;
}

class Player extends Schema {
	@type("string") public id = "";
	@type("int32") public score = 0;
	@type(Canvas) public canvas = new Canvas();
	@type(Paddle) public paddle = new Paddle();
	@type("string") public side: "top" | "bottom";
	@type("int32") lastProcessedInput = 0;
}

export class GameRoomState extends Schema {
	@type("int8") public gameStatus = GameRoomStatus.WAITING;

	@type([Player]) public players = new ArraySchema<Player>();

	@type(Ball) public ball = new Ball();

	@type("string") public serverUpdateTime = Date.now().toString();
}