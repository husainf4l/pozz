import { Routes } from '@angular/router';
import { loggedInGuard } from '../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
    canActivate: [loggedInGuard],
    title: 'Admin Sign in – Pozz',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
