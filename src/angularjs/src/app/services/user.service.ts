import { Injectable } from "@angular/core";
import { BackService } from "./back.service";
import { UserI, DefUserI } from "../interfaces/chat.interface";

@Injectable({
	providedIn: "root",
})
export class UserService {
	constructor(
		private backService: BackService,
	) {}
	private user: UserI = DefUserI;

	getToken()
	{
		return (localStorage.getItem("access_token"));
	}

	async checkToken(jwt_token: string): Promise<boolean>
	{
		await this.backService.req("GET", "/auth/profile")
			.catch((err: any) => {
				return false;
			})
		return true;
	}

	isLoggedIn()
	{
		if (this.getToken())
			return (true);
		else
			return (false);
	}

	SignOut()
	{
		localStorage.removeItem("access_token");
		// this.userLoggedIn = false;
		window.location.href = "/home";
	}

	async getUserInfo(): Promise<UserI>
	{
		return (await this.backService.req("GET", "/user/me"));
	}

	async updateInfo(nickname: string, email?: string)
	{
		let body;

		if (email)
			body = JSON.stringify({"nickname" : nickname, "email" : email});
		else
			body = JSON.stringify({"nickname" : nickname});
		return (await this.backService.req("PUT", "/user/me", body));
	}
}
