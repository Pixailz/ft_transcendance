import { Injectable, UnauthorizedException, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class Api42OAuthService {
	constructor(private jwtService: JwtService) {}
	async getToken(code: string, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<string> {
		console.log(req);
		if (req.cookies && req.cookies.access_token) {
			return await this.getTokenJwt(req.cookies.access_token);
		}
		else
		{
			const user_token = await this.getTokenApi(code);
			const payload = await this.jwtService.signAsync({user_token});
			res.cookie(
				"access_token", payload, {
					httpOnly: true,
					secure: false,
					expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
				}
			).send({status: "ok"});
			return (user_token);
		}
	}

	async getTokenJwt(jwtToken: string): Promise<string> {
		const payload = await this.jwtService.verifyAsync(jwtToken, {
			secret: process.env.JWT_SECRET,
		});
		return payload.user_token;
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
				redirect_uri: "http://localhost:3000/auth/login",
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
			return [jsonData.id, jsonData.login];
		} else {
			console.log("request failed: " + response.status);
			console.log("response: " + jsonData);
		}
	}
}
