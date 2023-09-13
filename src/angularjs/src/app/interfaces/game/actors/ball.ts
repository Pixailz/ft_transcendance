import * as ex from "excalibur";

export class Ball extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number,
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

    public override update(engine: ex.Engine, delta: number) {
        this.pos.x += this.vx;
        this.pos.y += this.vy;
        //check if ball is going to escape by the sides
        if (this.pos.x < this.width / 2) {
            this.pos.x = this.width / 2;
            this.vx *= -1;
        }
        if (this.pos.x + this.width / 2 > engine.drawWidth) {
            this.pos.x = engine.drawWidth - this.width / 2;
            this.vx *= -1;
        }
    }
}