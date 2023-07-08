import { Injectable, UnauthorizedException, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class Api42OAuthService {
	constructor(private jwtService: JwtService) {}

	async getTokenJwt(jwtToken: string) {
		try {
			const payload = await this.jwtService.verifyAsync(jwtToken, {
				secret: process.env.JWT_SECRET,
			});
			return payload.ft_id;
		}
		catch {
			throw new UnauthorizedException();
		}
	}

	async getTokenApi(code: string): Promise<string> {
		console.log(process.env.API42_USERID);
		console.log(process.env.API42_SECRET);
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
			console.log("response: " + JSON.stringify(jsonData));
			throw new UnauthorizedException();
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
			return jsonData.id;
		} else {
			console.log("request failed: " + response.status);
			console.log("response: " + jsonData);
		}
	}
}
