import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { UserService } from "./user.service";

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(
		private router: Router,
		private userService: UserService,
		) {}

	async canActivateRegister(returnUrl: string)
	{
		const user_info = await this.userService.getUserInfo();
		if (user_info.id === -1)
		{
			this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
			console.log("[angular:AuthGuardService] user not found, need to relogin");
			return false;
		}
		if (!user_info.nickname)
		{
			this.router.navigate(['/register'], { queryParams: { returnUrl: returnUrl }});
			console.log("[angular:AuthGuardService] user don't have a nickname, need to register");
			return false;
		}
		console.log(`[angular:AuthGuardService] user ${user_info.nickname} logged in`);
		return true;
	}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		let		returnUrl = route.queryParams['returnUrl'];
		const	jwt_token = this.userService.getToken();

		if (!returnUrl)
			returnUrl = state.url;
		if (!jwt_token)
		{
			this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
			console.log("[angular:AuthGuardService] no token");
			return false;
		}
		if (!await this.userService.checkToken())
		{
			this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
			console.log("[angular:AuthGuardService] bad token");
			return false;
		}
		if (state.url !== "/register")
			return await this.canActivateRegister(returnUrl);
		return true;
	}
}
