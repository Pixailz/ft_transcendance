import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/app/environments/environment';
import { BackService } from 'src/app/services/back.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	// animations: [
	// 	trigger('changeContent', [
	// 		transition(':leave', [
	// 			style({ transform: 'translateY(0%)' }),
	// 			animate(300, style({ transform: 'translateY(-100%)' }))
	// 		]),
	// 		transition(':enter', [
	// 			style({ transform: 'translateY(-100%)' }),
	// 			animate(300, style({ transform: 'translateY(0%)' }))
	// 		])
	// 	])
	// ]
})
export class LoginComponent  implements OnInit {
	code: string | null = null;
	response: any = null;
	state: any = null;
	isButtonClickable: boolean = true;

	constructor(private route: ActivatedRoute, 
				private router: Router,
				private http: HttpClient) {}

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
		if (!this.response || this.response.access_token === undefined)
			console.log('Error: ' + this.response);
		localStorage.setItem('access_token', this.response.access_token);
		if (this.response.status == "register")
			this.router.navigate(['/register']);
	}

	SignIn()
	{
		window.location.href = environment.after_auth_uri 
		+'&state='
		+btoa(JSON.stringify({'redirect': this.route.snapshot.queryParamMap.get('returnUrl')}))
	};
}
