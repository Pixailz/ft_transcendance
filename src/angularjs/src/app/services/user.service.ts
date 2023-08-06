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

	async updateInfo(nickname: string, email?: string)
	{
		let body;

		if (email)
			body = JSON.stringify({"nickname" : nickname, "email" : email});
		else
			body = JSON.stringify({"nickname" : nickname});
		return (await this.reqService.back("PUT", "/api/user/me", body));
	}
}
