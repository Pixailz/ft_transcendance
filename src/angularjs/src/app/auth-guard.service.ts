import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable()
export class authGuardService implements CanActivate {
	constructor(private route: Router) {}

	async canActivate(): Promise<boolean> {
		const jwt_token = localStorage.getItem("access_token");

		if (!jwt_token)
		{
			console.log("[authGuardService] no token");
			this.route.navigateByUrl('/home');
			return false;
		}
		const res = await fetch('/api/auth/profile', {
			method: 'GET',
			headers:  {
				'Authorization': 'Bearer ' + jwt_token
			},
			mode: 'cors'
		});
		if (res.status !== 200)
		{
			console.log("[authGuardService] bad token");
			return false;
		}
		return true;
	}
}
