import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';

import { environment } from 'src/app/environments/environment';
import { BackService } from 'src/app/services/back.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
	code: string | null = null;
	response: any = null;
	state: any = null;

	constructor(private route: ActivatedRoute, 
				private router: Router,
				private http: HttpClient,
				private back: BackService) {}

	async ngOnInit() {
		this.code = this.route.snapshot.queryParamMap.get('code');
		this.state = this.route.snapshot.queryParamMap.get('state');
	
		if (this.code !== null) {
		  await this.getToken();
		}
		if (this.state !== null) {
			if (this.state?.redirect)
				this.router.navigate([this.state.redirect]);
			this.state = atob(this.state);
			this.state = JSON.parse(this.state);
			this.state?.redirect 
				? this.router.navigate([this.state.redirect])
				: this.router.navigate(['/']);
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
		await this.back.req('GET', '/auth/ft_callback?code=' + this.code)
		.catch((error) => {
			if (message)
			{
				message.innerHTML = 'Error: ' + error.statusText;
				message.style.color = 'red';
			}
		})
		.then((data) => {
			this.response = data;
			if (!this.response || this.response.access_token === undefined)
				throw new Error('No access token');
			localStorage.setItem('access_token', this.response.access_token);
			if (this.response.status == "register")
				this.state.redirect = '/register';
		});
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri 
		+'&state='
		+btoa(JSON.stringify({'redirect': this.route.snapshot.queryParamMap.get('returnUrl')}))
	};
}
