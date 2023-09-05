import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TwofaformComponent } from '../twofaform/twofaform.component';

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrordialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TwofaformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  error = this.data.error;
  firstLine = this.error.message.split('\n')[0];
  stackTrace = this.error.stack.split('\n').slice(1).join('\n');

  close(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    this.dialogRef.close(feedback.checked ? 'feedback' : 'close');
  }
}
