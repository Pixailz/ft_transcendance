import { Component } from '@angular/core';
import { GameService } from 'src/app/services/websocket/game/service';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent {
	constructor (
		public gameService: GameService,
	) {}
}
