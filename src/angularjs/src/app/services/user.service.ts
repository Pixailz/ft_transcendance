import { Injectable, OnInit } from "@angular/core";
import { BackService } from "./back.service";
import { DefUserI, Status, UserI } from "../interfaces/user.interface";

@Injectable({
	providedIn: "root",
})
export class UserService{
	constructor(
		private backService: BackService,
	) { }
	user: UserI = DefUserI;


	// AUTH
	getToken(): string {
		return (localStorage.getItem("access_token")
			? localStorage.getItem("access_token")!
			: "");
	}

	async checkToken(): Promise<boolean> {
		const user = await this.backService.req("GET", "/auth/profile")
			.catch((err: any) => {
				console.log("[angular:UserService] checkToken req err: ", err);
				return (false);
			})
		return user?.user_id;
	}

	SignOut() {
		localStorage.removeItem("access_token");
		window.location.href = "/home";
	}

	async getUserInfo(): Promise<UserI> {
		let user = await this.backService.req("GET", "/user/me");
		user?.id
			? user = user as UserI
			: user = DefUserI;
		if (this.isGoodUser(user))
			this.user = user;
		return (user);
	}

	async updateProfile(user: UserI): Promise<any> {
		return (await this.backService.req("PUT", "/user/me", JSON.stringify(user)));
	}

	async updateInfo(nickname: string, email?: string) {
		let body;

		if (email)
			body = JSON.stringify({ "nickname": nickname, "email": email });
		else
			body = JSON.stringify({ "nickname": nickname });
		return (await this.backService.req("PUT", "/user/me", body));
	}

	async setupTwoFa(): Promise<any> {
		const user = await this.getUserInfo();
		let nonce = "";
		let qrcode;

		if (user.twoAuthFactor || user.id < 0)
			return (Promise.reject("User already setup or need to relogin."));

		await this.backService.req("GET", "/user/nonce")
		.catch((err: any) => {
			console.log("[angular:UserService] setupTwoFa req err: ", err);
			return (Promise.reject(err));
		})
		.then((res: any) => {
			nonce = res.nonce;
		});

		await this.backService.req("GET", "/2fa/setup/" + nonce)
		.then((res: any) => {
			qrcode = res;
		})
		.catch((err: any) => {
			console.log("[angular:UserService] setupTwoFa req err: ", err);
			return (Promise.reject(err));
		});

		return (Promise.resolve(qrcode));
	}

	async disableTwoFa(): Promise<boolean> {
		const response = await this.backService.req("POST", "/2fa/disable");
		return response.affected > 0;
	}

	async getNonce(): Promise<string> {
		const response = await this.backService.req("GET", "/user/nonce");
		return (response.nonce);
	}

	getUserInfoFormated(user: UserI | undefined) {
		if (!user)
			return "";
		var tmp;
		switch (user.status) {
			// case Status.CONNECTED: {
			// 	const last_seen = new Date(dest.lastSeen);
			// 	const now = new Date(Date.now());
			// 	console.log("last ", last_seen);
			// 	console.log("now  ", now);
			// 	if (last_seen.getTime() < now.getTime() - 5000)
			// 		tmp = "🟠 ";
			// 	else
			// 		tmp = "🟢 ";
			// 	break ;
			// }
			case Status.AWAY: {
				tmp = "🟠 ";
				break;
			}
			case Status.CONNECTED: {
				tmp = "🟢 ";
				break;
			}
			case Status.DISCONNECTED: {
				tmp = "⚫ "
				break;
			}
		}
		tmp += user.ftLogin + " ";
		if (user.nickname)
			tmp += ` (${user.nickname})`
		return (tmp);
	}

	isGoodUser(user: UserI)
	{
		if (!user || user.id === -1)
			return (false);
		return (true);
	}
}
