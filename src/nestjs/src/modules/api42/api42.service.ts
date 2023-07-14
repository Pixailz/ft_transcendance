import { Injectable } from '@nestjs/common';

@Injectable()
export class Api42Service {

	async getTokenFromCode(code: string): Promise<string> {
		const url = 'https://api.intra.42.fr/oauth/token';
		const data = {
			grant_type: 'authorization_code',
			client_id: process.env.API42_USERID,
			client_secret: process.env.API42_SECRET,
			code: code,
			redirect_uri: process.env.API42_REDIRECTURL,
		};
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		});
		const json = await response.json();
		if (response.status !== 200) {
			throw new Error(json.error);
		}
		return json.access_token;
	}

	async getUserFromToken(token: string): Promise<any> {
		const url = 'https://api.intra.42.fr/v2/me';
		const response = await fetch(url, {
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		});
		const json = await response.json();
		if (response.status !== 200) {
			throw new Error(json.error);
		}
		return json;
	}

	async getUserFromCode(code: string): Promise<any> {
		const token = await this.getTokenFromCode(code);
		const user = await this.getUserFromToken(token);
		return user;
	}

	async getIdFromCode(code: string): Promise<number> {
		const token = await this.getTokenFromCode(code);
		const user = await this.getUserFromToken(token);
		return user.id;
	}

	async getIdFromToken(token: string): Promise<number> {
		const user = await this.getUserFromToken(token);
		return user.id;
	}

	async getLoginFromToken(token: string): Promise<string> {
		const user = await this.getUserFromToken(token);
		return user.login;
	}
}
