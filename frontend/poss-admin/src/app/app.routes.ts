import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/auth.guard';
import { localeGuard } from './core/guards/locale.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/en', pathMatch: 'full' },

  {
    path: ':locale',
    canActivate: [localeGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
        canActivate: [adminGuard],
        title: 'Admin Dashboard – Pozz',
        children: [
          {
            path: '',
            loadComponent: () => import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Overview – Pozz Admin',
          },
          {
            path: 'users',
            loadComponent: () => import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Users – Pozz Admin',
          },
          {
            path: 'companies',
            loadComponent: () => import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Companies – Pozz Admin',
          },
          {
            path: 'projects',
            loadComponent: () => import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Projects – Pozz Admin',
          },
          {
            path: 'investments',
            loadComponent: () => import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Investments – Pozz Admin',
          },
          {
            path: 'settings',
            loadComponent: () => import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Settings – Pozz Admin',
          },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '/en' },
];
