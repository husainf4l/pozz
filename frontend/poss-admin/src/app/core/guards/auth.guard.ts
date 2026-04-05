import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Allows only authenticated users with an admin role.
 * Everyone else is sent to the login page.
 */
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) return true;
  return router.createUrlTree(['/en/auth/login']);
};

/**
 * Redirects already-logged-in admin users away from login.
 */
export const loggedInGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return router.createUrlTree(['/en/dashboard']);
  }
  return true;
};
