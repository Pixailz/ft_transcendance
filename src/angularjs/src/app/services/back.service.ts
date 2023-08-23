import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class BackService {

	private headers: any = null;
	private body: any = null;

	async req(method: string, route: string, body?: any): Promise<any>
	{
		const jwt_token = localStorage.getItem("access_token");
		if (!jwt_token)
			return null;
		const bearer_token = "Bearer " + jwt_token;
		switch (method) {
			case "GET":
				this.headers = {
					"Authorization": bearer_token
				}
				this.body = null;
				break;
			case "POST":
			case "PUT":
				this.headers = {
					"Authorization": bearer_token,
					"Content-Type": "application/json"
				}
				this.body = body;
				break;
			default:
				return (Promise.reject("method not implemented yeet"));
		}
		return (await this.doReq(method, environment.api_prefix + route));
	}

	private async doReq(method: string, route: string): Promise<any>
	{
		const res = await fetch(route, {
			"method": method,
			"headers": this.headers,
			"body": this.body,
			"mode": "cors"
		});
		const log_header = `[${res.status}:${route}] ${method}`;
		if (res.status > 400)
			return Promise.reject({
				status: res.status,
				message: `${log_header} request failed`
			});
		const data_json = await res.json()
			.catch((err) => {
				return (Promise.reject({status: `${log_header} no data returned`}));
			})
		return (data_json);
	}

}
