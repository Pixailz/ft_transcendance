import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { GameStatus } from 'src/app/interfaces/game/game.interface';
import { GameService } from 'src/app/services/websocket/game/service';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
	selector: 'app-game-started',
	templateUrl: './started.component.html',
	styleUrls: ['./started.component.scss']
})
export class GameStartedComponent implements OnInit {
	constructor(
		private gameService: GameService,
		private wsGateway: WSGateway,
	) {}

	async ngOnInit()
	{
		var i = 0;
		while (this.gameService.room.status === GameStatus.STARTED)
		{
			this.wsGateway.gameSendStatus("oke " + ++i);
			await sleep(1 / environment.tickrate);
		}
	}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms * 1000));
