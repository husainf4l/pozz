import { Routes } from '@angular/router';
import { loggedInGuard } from '../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
    canActivate: [loggedInGuard],
    title: 'Sign in – Pozz',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.RegisterComponent),
    canActivate: [loggedInGuard],
    title: 'Create account – Pozz',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
