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
			console.log("[angular:AuthGuardService] no token");
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
			console.log("[angular:AuthGuardService] bad token");
			this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
			return false;
		}
		if (state.url != "/register")
		{
			await this.userService.getUserInfo()
				.then((data) => {
					if (!data.nickname)
					{
						console.log("[angular:AuthGuardService] user don't have a nickname, need to register");
						this.router.navigate(['/register'], { queryParams: { returnUrl: returnUrl }});
						return false;
					}
					console.log(`[angular:AuthGuardService] user ${data.nickname} logged in`);
					return true;
				})
				.catch((err) => {
					console.log("[angular:AuthGuardService] user not found, need to relogin");
					this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
					return false;
				})
		}
		return true;
	}
}
