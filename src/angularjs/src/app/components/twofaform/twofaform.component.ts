import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { BackService } from 'src/app/services/back.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-twofaform',
  templateUrl: './twofaform.component.html',
  styleUrls: ['./twofaform.component.scss']
})
export class TwofaformComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private back: BackService,
              private userService: UserService,
              public dialogRef: MatDialogRef<TwofaformComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  qrCode: string = this.data.qrCode;
  notice: string = this.data.notice;
  nonce: string = this.data.nonce;

  ngOnInit() {
  }

  async sendTwoFa() {
    const nonce = this.route.snapshot.queryParamMap.get('nonce') || this.nonce;
    const code = document.getElementById('code') as HTMLInputElement;
    const status = document.getElementById('status') as HTMLParagraphElement;

    if (code.value.length !== 6) {
      status.innerText = 'Please enter a valid code.';
      return;
    }

    let uri = '/2fa/verify/' + nonce + '/' + code.value;
    if (this.qrCode && code.value != "")
      uri = '/2fa/setup/' + nonce + '/' + code.value;

    const response = await this.back.req(
      'POST', 
      uri)
    .then((res) => {
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
