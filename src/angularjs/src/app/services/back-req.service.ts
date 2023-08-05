import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class reqService {
	private headers: any = null;
	private body: any = null;

	async Back(method: string, route: string, body?: any): Promise<any>
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
		const req = await fetch(route, {
			"method": method,
			"headers": this.headers,
			"body": this.body,
			"mode": "cors"
		});
		if (req.status !== 200)
			return Promise.reject({status: method + " request to the back failed"});
		return (Promise.resolve(req.json()));
	}

}
