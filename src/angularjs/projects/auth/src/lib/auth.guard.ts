import { CanActivateFn } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = new AuthService();

  return authService.isAuthenticated()
    .then(
      (isAuthenticated: boolean) => {
      if (isAuthenticated) {
        return true;
      }
      return false;
    });
};
