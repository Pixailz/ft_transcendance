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

	getToken(): string
	{
		return (localStorage.getItem("access_token")
				? localStorage.getItem("access_token")!
				: "");
	}

	async checkToken(): Promise<boolean>
	{
		const user = await this.backService.req("GET", "/auth/profile")
			.catch((err: any) => {
				console.log("[angular:UserService] checkToken req err: ", err);
				return (false);
			})
		return user?.user_id;
	}

	SignOut()
	{
		localStorage.removeItem("access_token");
		window.location.href = "/home";
	}

	async getUserInfo(): Promise<UserI>
	{
		let user = await this.backService.req("GET", "/user/me");
		user?.id
		? user = user as UserI
		: user = DefUserI;
		return (user);
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
