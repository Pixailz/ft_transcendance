import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from 'src/app/services/websocket/game/service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-game-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss']
})
export class GameLobbyComponent {
	gameOptform!: FormGroup;

	constructor(
		public gameService: GameService,
		public matDialog: MatDialog,
		private formBuilder: FormBuilder,
	) {
		this.gameOptform = this.formBuilder.group({
			powerUps: false,
			maps: {
				name: "normal",
				thumbnail: "/assets/images/maps/normal.png"
			},
			is_private: false,
		}, { updateOn: "change" });
	}

	searchGame()
	{
		this.gameService.searchGame(this.gameOptform.value);
	}
}
