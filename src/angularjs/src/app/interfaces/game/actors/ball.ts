import * as ex from "excalibur";

export class Ball extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        width: number,
        height: number,
        color: ex.Color,
    ) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            color: color,
        });
    }
}