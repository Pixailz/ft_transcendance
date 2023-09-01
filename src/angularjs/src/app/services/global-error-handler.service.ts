import { ErrorHandler, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackService } from './back.service';
import { ErrordialogComponent } from '../components/errordialog/errordialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})

export class GlobalErrorHandlerService implements ErrorHandler {

	constructor(
		public dialog: MatDialog,
		private backService: BackService,
		private router: Router) { }

	handleError(error: any): void {
		this.dialog.open(ErrordialogComponent, {
			data: { error }
		})
		.afterClosed().subscribe((res) => {
			if (res === 'feedback') {
				const currentUrl = this.router.url;
				const err = {
					message: error.message,
					url: currentUrl,
					stack: error.stack
				};
				this.backService.req('POST', '/errorlog', JSON.stringify(err));
			}
			console.error(error);
		});
	}
}
