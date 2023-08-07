import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { UserService } from "./user.service";

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(private router: Router, private userService: UserService) {}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		const jwt_token = localStorage.getItem("access_token");
		let returnUrl = route.queryParams['returnUrl'];
		if (!returnUrl)
			returnUrl = state.url;

		if (!jwt_token)
		{
			console.log("[AuthGuardService] no token");
			this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
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
			console.log("[AuthGuardService] bad token");
			this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
			return false;
		}
		if (state.url != "/register")
		{
			this.userService.getUserInfo()
				.then((data) => {
					if (!data.nickname)
					{
						console.log("[authGuardService] user not found, need to register");
						this.router.navigate(['/register'], { queryParams: { returnUrl: returnUrl }});
						return false;
					}
					return true;
				})
		}
		return true;
	}
}
