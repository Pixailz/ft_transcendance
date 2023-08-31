import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TwofaformComponent } from 'src/app/components/twofaform/twofaform.component';

import { environment } from 'src/app/environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})

export class LoginComponent  implements OnInit {
	code: string | null = null;
	response: any = null;
	state: any = null;
	isButtonClickable: boolean = true;

	constructor(private route: ActivatedRoute, 
				private router: Router,
				private http: HttpClient,
				public dialog: MatDialog) {}

	async ngOnInit() {
		this.code = this.route.snapshot.queryParamMap.get('code');
		this.state = this.route.snapshot.queryParamMap.get('state');
		
		if (this.state !== null) {
			try {
				this.state = atob(this.state);
				this.state = JSON.parse(this.state);
			} catch (e) {
				console.log(e);
				this.state = null;
			}
		}

		if (this.code !== null) {
		  await this.getToken();
		  this.state.redirect 
		  ? this.router.navigate([this.state.redirect]) 
		  : this.router.navigate(['/']);
		}
	  }

	async getToken()
	{
		this.isButtonClickable = false;
		
		this.response = await this.http.get(environment.api_prefix + '/auth/ft_callback?code=' + this.code)
		.toPromise()
		.catch((err) => {
			console.log(err);
				const message = document.getElementById('message');
				if (message)
					message.innerHTML = 'Error: ' + err.error;
				return null;
			});

		if (!this.response || (this.response.access_token === undefined
								&& this.response.status === undefined))
			console.log('Error: ' + this.response);

		if (this.response.status && this.response.status == "2fa"){
			this.dialog.open(TwofaformComponent, {
				data: {
					notice: "Please enter the code from your authenticator app",
					nonce: this.response.nonce.nonce,
					returnUrl: this.state.redirect,
				},
				closeOnNavigation: false,
				disableClose: true
			})
			.afterClosed()
			.subscribe((res) => {
				if (res && res.status == "oke")
				{
					localStorage.setItem('access_token', res.access_token);
					if (this.state?.redirect)
						this.router.navigate([this.state.redirect]);
					else
						this.router.navigate(['/home']);
				}
			})
		}

		localStorage.setItem('access_token', this.response.access_token);
		if (this.response.status == "register")
			this.router.navigate(['/register']);
		else if (this.response.status == "oke" && this.state?.redirect)
			this.router.navigate([this.state.redirect]);
		else
			this.router.navigate(['/home']);
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri 
		+'&state='
		+btoa(JSON.stringify({redirect: this.route.snapshot.queryParamMap.get('returnUrl')}))
	};
}