import * as ex from "excalibur";

export class Paddle extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        width: number,
        height: number,
        color: ex.Color,
        public upKey: ex.Input.Keys,
        public downKey: ex.Input.Keys
    ) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
            color: color,
        });
    }

    public draw(ctx: CanvasRenderingContext2D, delta: number) {
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
}