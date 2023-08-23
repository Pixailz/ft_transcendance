import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { BackService } from 'src/app/services/back.service';

@Component({
  selector: 'app-twofaform',
  templateUrl: './twofaform.component.html',
  styleUrls: ['./twofaform.component.css']
})
export class TwofaformComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private back: BackService) { }

  ngOnInit() {
  }

  async sendTwoFa() {
    const nonce = this.route.snapshot.queryParamMap.get('nonce');
    const redirect = this.route.snapshot.queryParamMap.get('returnUrl');
    const code = document.getElementById('code') as HTMLInputElement;

    const response = await this.back.req(
      'POST', 
      '/auth/2fa', 
      JSON.stringify({nonce: nonce, code: code.value}))
    .then((res: any) => {
      if (res.status === 'oke') {
        localStorage.setItem('access_token', res.access_token);
        redirect ? this.router.navigate(['/']) : this.router.navigate([redirect]);
      }
    })
  }

}
