import { Routes } from '@angular/router';
import { onboardingCompleteGuard, pendingOnboardingGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding').then((m) => m.OnboardingComponent),
    canActivate: [pendingOnboardingGuard],
    title: 'Getting started – Pozz',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [onboardingCompleteGuard],
    title: 'Dashboard – Pozz',
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
