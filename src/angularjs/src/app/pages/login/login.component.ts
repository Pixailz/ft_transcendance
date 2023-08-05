import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
		try {
			this.http.get('/api/auth/ft_callback?code=' + this.code).subscribe((data) => {
				this.response = data;
				localStorage.setItem('access_token', this.response.access_token);
				if (this.response.status == "register")
					window.location.href = '/register';
				else
					window.location.href = '/home';
			});
		} catch (e) {
			console.log(e);
		}
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri;
	};
}
