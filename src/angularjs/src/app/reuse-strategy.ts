import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class CustomReuseStrategy implements RouteReuseStrategy {
	storedRouteHandles = new Map<string, DetachedRouteHandle>();
	// Decides if the route should be stored
	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return route.data['reuseRoute'] === true;
	}

	//Store the information for the route we're destructing
	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		if (!route.routeConfig?.path)
			return;
		this.storedRouteHandles.set(route.routeConfig?.path, handle);
	}

	//Return true if we have a stored route object for the next route
	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		if (!route.routeConfig?.path)
			return false;
		return this.storedRouteHandles.has(route.routeConfig.path);
	}

	//If we returned true in shouldAttach(), now return the actual route data for restoration
	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		if (!route.routeConfig?.path)
			return {} as DetachedRouteHandle;
		return this.storedRouteHandles.get(route.routeConfig.path) || {} as DetachedRouteHandle;
	}

	//Reuse the route if we're going to and from the same route
	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		return future.routeConfig === curr.routeConfig;
	}
}