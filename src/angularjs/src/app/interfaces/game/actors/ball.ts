import * as ex from "excalibur";

export class Ball extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        color: ex.Color,
        radius: number = 20
    ) {
        super({
            x: x,
            y: y,
            color: color,
            radius: radius,
        });
    }
}