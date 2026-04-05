import { Routes } from '@angular/router';
import { onboardingCompleteGuard, pendingOnboardingGuard } from './core/guards/auth.guard';
import { localeGuard } from './core/guards/locale.guard';

export const routes: Routes = [
  // Redirect bare root to the default locale
  { path: '', redirectTo: '/en', pathMatch: 'full' },

  // All app routes live under /:locale
  {
    path: ':locale',
    canActivate: [localeGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./onboarding/onboarding').then((m) => m.OnboardingComponent),
        canActivate: [pendingOnboardingGuard],
        title: 'Getting started – Pozz',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.DashboardComponent),
        canActivate: [onboardingCompleteGuard],
        title: 'Dashboard – Pozz',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Fallback: redirect any unknown path to /en
  { path: '**', redirectTo: '/en' },
];
