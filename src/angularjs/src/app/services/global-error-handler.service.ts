import { ErrorHandler, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackService } from './back.service';
import { ErrordialogComponent } from '../components/errordialog/errordialog.component';

@Injectable({
  providedIn: 'root'
})

export class GlobalErrorHandlerService implements ErrorHandler{

  constructor(
    public dialog: MatDialog,
    private backService: BackService) { }

  handleError(error: any): void {
    this.dialog.open(ErrordialogComponent, {
      data: { error }
    })
    .afterClosed().subscribe(() => {
      this.backService.req('POST', 'errorlog', { error });
      console.error(error);
    });
  }
}
