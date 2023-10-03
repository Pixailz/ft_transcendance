import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BackService } from 'src/app/services/back.service';

@Component({
	selector: 'app-twofaform',
	templateUrl: './twofaform.component.html',
	styleUrls: ['./twofaform.component.scss']
})
export class TwofaformComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private back: BackService,
		public dialogRef: MatDialogRef<TwofaformComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
	}


	qrCode: string = this.data.qrCode;
	notice: string = this.data.notice;
	nonce: string = this.data.nonce;

	ngOnInit() {
	}

	async sendTwoFa(code: string) {
		const nonce = this.route.snapshot.queryParamMap.get('nonce') || this.nonce;
		const status = document.getElementById('status') as HTMLParagraphElement;

		let uri = '/2fa/verify/' + nonce + '/' + code;

		if (this.qrCode && code != "")
			uri = '/2fa/setup/' + nonce + '/' + code;

		const response = await this.back.req('POST', uri)
			.then((res: any) => {
				this.dialogRef.close(res);
			})
			.catch((err: any) => {
				console.log(err);
				status.innerText = 'An error occured. Please verify your code and try again.';
				status.style.display = 'block';
				status.style.color = 'red';
			})
	}
}
