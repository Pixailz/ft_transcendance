import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
	nickname:string = '';
	mail:string = '';
	
	constructor(private http: HttpClient) {
  	}

	async ngOnInit() {
		const jwt_token = localStorage.getItem("access_token");
		try {
			this.http.get('/api/user/me', {
				headers:  {'Authorization': 'Bearer ' + jwt_token,
			}}).subscribe((data) => {
				let response:any = data;
				this.nickname = response.nickname;
				this.mail = response.email;
			});
		} catch (e) {
			console.log(e);
		}
	}

  	async onSubmit() {
		if (this.nickname)
		{
			const jwt_token = localStorage.getItem("access_token");

			let res = await fetch('/api/user/me', {
				method: 'PUT',
				headers:  {
					'Authorization': 'Bearer ' + jwt_token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'nickname' : this.nickname,
					'email' : this.mail
				}),
				mode: 'cors'
			});
		}
  }
}
