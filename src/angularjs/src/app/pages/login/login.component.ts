import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';

import { environment } from 'src/app/environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
	code: string | null = null;
	response: any = null;

	constructor(private route: ActivatedRoute, private http: HttpClient) { }

	ngOnInit() {
		this.code = this.route.snapshot.queryParamMap.get('code');

		if (this.code !== null) {
			this.getToken();
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
		this.http.get('/api/auth/ft_callback?code=' + this.code).subscribe(
		(data) => {
			this.response = data;
			if (!this.response || this.response.access_token === undefined)
				throw new Error('No access token');
			localStorage.setItem('access_token', this.response.access_token);
			if (this.response.status == "register")
				window.location.href = '/register';
			else
				window.location.href = '/home';
			},
		(error) => {
			if (message)
				{
					message.innerHTML = 'Error: ' + error.statusText;
					message.style.color = 'red';
				}
		});
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri;
	};
}
