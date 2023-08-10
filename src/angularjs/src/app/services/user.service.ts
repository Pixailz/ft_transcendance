import { Injectable } from "@angular/core";
import { ReqService } from "./back-req.service";

@Injectable({
	providedIn: "root",
})
export class UserService {
	constructor(private reqService: ReqService) {  }
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
		window.location.href = "/home";
	}

	async getUserInfo(): Promise<any>
	{
		return (await this.reqService.back("GET", "/api/user/me"));
	}

	async updateInfo(user: any): Promise<any>
	{
		return (await this.reqService.back("PUT", "/api/user/me", user));
	}

	async	getRoomIds(): Promise<any>
	{
		return (await this.reqService.back("GET", "/api/db/user_chat_room/me"));
	}
}
