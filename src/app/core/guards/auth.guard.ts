import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthInitialized()) {
    return false;
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
