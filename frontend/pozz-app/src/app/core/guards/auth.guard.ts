import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '../services/translate.service';

/** Redirects unauthenticated users to /:locale/auth/login. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const locale = inject(TranslateService).currentLocale();
  return auth.isLoggedIn() ? true : router.createUrlTree([`/${locale}/auth/login`]);
};

/**
 * Guards the /dashboard and other protected pages.
 * - Not logged in → /:locale/auth/login
 * - Logged in but onboarding pending → /:locale/onboarding
 * - Logged in + complete (or no onboarding) → allow
 */
export const onboardingCompleteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const locale = inject(TranslateService).currentLocale();

  if (!auth.isLoggedIn()) {
    return router.createUrlTree([`/${locale}/auth/login`]);
  }

  const ob = auth.onboarding();
  if (ob && ob.role !== 'Unknown' && !ob.isComplete) {
    return router.createUrlTree([`/${locale}/onboarding`]);
  }

  return true;
};

/**
 * Guards the /onboarding page.
 * - Not logged in → /:locale/auth/login
 * - Already complete or no onboarding → /:locale/dashboard
 * - Pending onboarding → allow
 */
export const pendingOnboardingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const locale = inject(TranslateService).currentLocale();

  if (!auth.isLoggedIn()) {
    return router.createUrlTree([`/${locale}/auth/login`]);
  }

  const ob = auth.onboarding();
  if (!ob || ob.role === 'Unknown' || ob.isComplete) {
    return router.createUrlTree([`/${locale}/dashboard`]);
  }

  return true;
};

/**
 * Guards login/register pages.
 * - Already logged in + pending onboarding → /onboarding
 * - Already logged in + complete/unknown → /dashboard
 * - Not logged in → allow
 */
export const loggedInGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }

  const ob = auth.onboarding();
  if (ob && ob.role !== 'Unknown' && !ob.isComplete) {
    return router.createUrlTree(['/onboarding']);
  }

  return router.createUrlTree(['/dashboard']);
};
