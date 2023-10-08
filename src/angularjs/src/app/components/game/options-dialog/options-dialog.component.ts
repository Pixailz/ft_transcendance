import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameOptionI, MapI } from 'src/app/interfaces/game/game-room.interface';
import { GameService } from 'src/app/services/websocket/game/service';

@Component({
  selector: 'game-options-dialog',
  templateUrl: './options-dialog.component.html',
  styleUrls: ['./options-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsDialogComponent {
  maps: MapI[] = [];
  constructor(
		public matDialogRef: MatDialogRef<OptionsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: GameOptionI,
    private gameService: GameService,
	) {
      this.maps = this.gameService.maps;
      this.data.type = "custom"
  }

	onNoClick(): void {
		this.matDialogRef.close();
	}
}