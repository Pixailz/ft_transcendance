import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {
  canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    
    //create a rectangle with two vertical lines, mimicking a pong game
    //the lines will be the paddles, and the rectangle will be the ball
    //left line will be user controlled, and right line will be event controlled (online opponent)
    this.ctx.beginPath();
    this.ctx.rect(20, 20, 150, 100);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, 200);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(200, 0);
    this.ctx.lineTo(200, 200);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(100, 100, 20, 0, Math.PI*2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();

    //hook up the keypress event to the canvas
    this.canvas.addEventListener("keypress", this.onCanvasKeypress);
  }

  //make the bars move up and down when the up and down keys are pressed
  onCanvasKeypress(event: KeyboardEvent){
    if (event.key === "ArrowUp") {
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0); 
      this.ctx.lineTo(0, 200);
      this.ctx.stroke();
      
    }
  }

}
