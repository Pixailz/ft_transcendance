import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class Api42OAuthService {
	async getToken(code: string) {
		const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				grant_type: "authorization_code",
				client_id: process.env.API42_USERID,
				client_secret: process.env.API42_SECRET,
				code: code,
				redirect_uri: "http://localhost:3000/auth",
			}),
		});
		const jsonData = await response.json();
		if (response.status === 200) {
			return jsonData.access_token;
		} else {
			console.log("request failed: " + response.status);
			console.log("response: " + jsonData);
		}
	}

	async getUserId(userToken: string) {
		const response = await fetch("https://api.intra.42.fr/v2/me", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + userToken,
			},
		});
		const jsonData = await response.json();
		if (response.status === 200) {
			return [jsonData.id, jsonData.login];
		} else {
			console.log("request failed: " + response.status);
			console.log("response: " + jsonData);
		}
	}
}
