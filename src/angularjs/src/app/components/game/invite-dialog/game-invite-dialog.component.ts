import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-invite-dialog',
  templateUrl: './game-invite-dialog.component.html',
  styleUrls: ['./game-invite-dialog.component.scss']
})
export class GameInviteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GameInviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectFriend(friendId: number): void {
    this.dialogRef.close(friendId);
  }
}
