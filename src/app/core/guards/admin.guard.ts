import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    const user = authService.getDecodedAccessToken();
    if (user?.role === 'admin') {
      return true;
    }
  }

  router.navigate(['/']);
  return false;
};
