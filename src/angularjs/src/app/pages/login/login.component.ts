import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

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
	twofa: boolean = false;
	login: boolean = true;

	constructor(private route: ActivatedRoute, 
				private router: Router,
				private http: HttpClient) {}

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
		}

		if (this.route.snapshot.queryParamMap.get('twofa') == 'true') {
			this.twofa = true;
			this.login = false;
		}

	  }

	async getToken()
	{
		const button = document.getElementById('login');
		const message = document.getElementById('message');
		if (button && message)
		{		
			button.style.display = 'none';
			message.style.display = 'block';
			message.innerHTML = 'Please wait...';
		}
		
		this.response = await this.http.get(environment.api_prefix + '/auth/ft_callback?code=' + this.code)
			.toPromise()
			.catch((err) => {
				console.log(err);
				if (message)
					message.innerHTML = 'Error: ' + err.error;
				return null;
			});
		if (!this.response 
			|| (this.response.access_token === undefined
				&& this.response.status === undefined))
			console.log('Error: ' + this.response);
		if (this.response.status && this.response.status == "2fa"){
			this.router.navigate(['/login'], {
				queryParams: { 
					twofa: true,
					returnUrl: this.state?.redirect!, 
					nonce: this.response.nonce
				}
			});
		}
		localStorage.setItem('access_token', this.response.access_token);
		if (this.response.status == "register")
			this.router.navigate(['/register']);
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri 
		+'&state='
		+btoa(JSON.stringify({redirect: this.route.snapshot.queryParamMap.get('returnUrl')}))
	};
}