import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class authGuardService implements CanActivate {
	constructor(private router: Router) {}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		const jwt_token = localStorage.getItem("access_token");

		if (!jwt_token)
		{
			console.log("[authGuardService] no token");
			this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
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
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
			return false;
		}
		return true;
	}
}
