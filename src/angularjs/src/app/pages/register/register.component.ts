import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	nickname:string = '';
	mail:string = '';

	constructor(private http: HttpClient) {
	}

	async onSubmit() {
		if (this.nickname)
		{
			const jwt_token = localStorage.getItem("access_token");
			let body;
			if (this.mail)
				body = JSON.stringify({'nickname' : this.nickname, 'email' : this.mail});
			else
				body = JSON.stringify({'nickname' : this.nickname});
			let res:any = await fetch('/api/user/me', {
				method: 'PUT',
				headers:  {
					'Authorization': 'Bearer ' + jwt_token,
					'Content-Type': 'application/json'
				},
				body: body,
				mode: 'cors'
			}).catch(
				(err) => {
				}
			)
			.then( () => {
				window.location.href = '/home';
			})			
		}
	}
}
