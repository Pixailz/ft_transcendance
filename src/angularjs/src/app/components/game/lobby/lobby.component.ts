import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefGameOptionI } from 'src/app/interfaces/game/game-room.interface';
import { GameService } from 'src/app/services/websocket/game/service';
import { OptionsDialogComponent } from '../options-dialog/options-dialog.component';

@Component({
	selector: 'app-game-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss']
})
export class GameLobbyComponent {
	isInGame: boolean = false;

	constructor(
		public gameService: GameService,
		public matDialog: MatDialog,
	) { }


	searchGame()
	{ this.gameService.searchGame(DefGameOptionI); }

	customGame(){
		this.matDialog.open(OptionsDialogComponent, {
			data: DefGameOptionI,
			width: "400px",
		})
		.afterClosed().subscribe((result: any) => {
			if(result)
				this.gameService.searchGame(result);
		});
	}
}
