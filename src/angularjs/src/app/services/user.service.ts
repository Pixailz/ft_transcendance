import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class userService {
	constructor(private router: Router) {  }
	private userLoggedIn = false;

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
		this.router.navigate(["/login"]);
	}
}
