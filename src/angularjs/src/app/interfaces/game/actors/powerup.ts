import * as ex from "excalibur";

export class PowerUp extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        radius: number = 20
    ) {
        super({
            x: x,
            y: y,
            radius: radius,
        });
    }
}