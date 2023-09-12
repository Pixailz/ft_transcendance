import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onAction1() {
    console.log("Action 1");
  }

  onAction2() {
    console.log("Action 2");
  }

  onAction3() {
    console.log("Action 3");
  }

}
