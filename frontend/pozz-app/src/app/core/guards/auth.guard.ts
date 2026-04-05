import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirects unauthenticated users to /auth/login. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/auth/login']);
};

/**
 * Guards the /dashboard and other protected pages.
 * - Not logged in → /auth/login
 * - Logged in but onboarding pending → /onboarding
 * - Logged in + complete (or no onboarding) → allow
 */
export const onboardingCompleteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

  const ob = auth.onboarding();
  if (ob && ob.role !== 'Unknown' && !ob.isComplete) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};

/**
 * Guards the /onboarding page.
 * - Not logged in → /auth/login
 * - Already complete or no onboarding → /dashboard
 * - Pending onboarding → allow
 */
export const pendingOnboardingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

  const ob = auth.onboarding();
  if (!ob || ob.role === 'Unknown' || ob.isComplete) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
