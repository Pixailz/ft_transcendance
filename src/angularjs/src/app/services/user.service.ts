import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class userService {
	constructor(private router: Router, private http: HttpClient) {  }
	private userLoggedIn = false;
	response: any = null;

	isLoggedIn()
	{
		if (localStorage.getItem("access_token"))
			return (true);
		else
			return (false);
	}

	SignOut()
	{
		localStorage.removeItem("access_token");
		this.userLoggedIn = false;
		window.location.href = "/home";
	}

	async getUserInfo()
	{
		const jwt_token = localStorage.getItem("access_token");
		const req = await fetch('/api/user/me', {
			headers: {"Authorization": "Bearer " + jwt_token}
		});
		if (req.status !== 200)
			return Promise.reject({status: "no user"});
		return Promise.resolve(req.json());
	}

	async updateInfo(nickname: string, email?: string)
	{
		const jwt_token = localStorage.getItem("access_token");
		let body;
		if (email)
			body = JSON.stringify({'nickname' : nickname, 'email' : email});
		else
			body = JSON.stringify({'nickname' : nickname});
		let res:any = await fetch('/api/user/me', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + jwt_token,
				'Content-Type': 'application/json'
			},
			body: body,
			mode: 'cors'
		});
		return res.status;
	}
}
