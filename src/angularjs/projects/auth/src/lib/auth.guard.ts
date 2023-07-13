import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot,  RouterStateSnapshot,  CanActivate,  Router} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (AuthService.isAuthenticated()) return true;
        
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });    
        
        return false;  
    }
}
