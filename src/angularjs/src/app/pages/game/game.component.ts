import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/websocket/game/service';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent {
	constructor (
		public gameService: GameService,
		private params: ActivatedRoute,
	) {}

	ngOnInit() {
		const room_id = this.params.snapshot.paramMap.get("room_id");
		if (room_id) {
			this.gameService.joinGame(room_id);
		}
	}
}
