import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
    title: 'Sign in – Pozz',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.RegisterComponent),
    title: 'Create account – Pozz',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
