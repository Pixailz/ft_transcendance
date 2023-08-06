import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ReqService {
	private headers: any = null;
	private body: any = null;

	async back(method: string, route: string, body?: any): Promise<any>
	{
		const bearer_token = "Bearer " + localStorage.getItem("access_token");
		switch (method) {
			case "GET":
				this.headers = {
					"Authorization": bearer_token
				}
				this.body = null;
				break;
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
		return (await this.doReq(method, route));
	}

	private async doReq(method: string, route: string): Promise<any>
	{
		const res = await fetch(route, {
			"method": method,
			"headers": this.headers,
			"body": this.body,
			"mode": "cors"
		});
		if (res.status !== 200)
			return Promise.reject({status: method + " request to " + route + " failed"});
		return (Promise.resolve(res.json()));
	}

}
