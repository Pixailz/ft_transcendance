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
    public override update(engine: ex.Engine, delta: number) {
        if (engine.input.keyboard.isHeld(this.upKey)) {
            this.pos.x -= 10;
        }
        if (engine.input.keyboard.isHeld(this.downKey)) {
            this.pos.x += 10;
        }
        if (this.pos.x < this.width / 2) {
            this.pos.x = this.width / 2;
        }
        if (this.pos.x > engine.canvasWidth - (this.width / 2)) {
            this.pos.x = engine.canvasWidth - (this.width / 2);
        }
        // if (this.pos.x + this.width / 2 > engine.drawHeight) {
        //     this.pos.x = engine.drawHeight - this.width / 2;
        // }
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