import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class WSService {
	unsubscribeObservable(obs: Subscription)
	{
		obs.unsubscribe();
	}

	unsubscribeObservables(obs: Subscription[])
	{
		for (var i = 0; i < obs.length; i++)
			obs[i].unsubscribe();
	}
}

