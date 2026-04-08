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
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./dashboard/overview/overview').then((m) => m.OverviewComponent),
            title: 'Dashboard – Pozz',
          },
          {
            path: 'investors',
            loadComponent: () =>
              import('./dashboard/investors/investors').then((m) => m.InvestorsComponent),
            title: 'Investors – Pozz',
          },
          {
            path: 'investors/:id',
            loadComponent: () =>
              import('./dashboard/investors/investor-detail').then((m) => m.InvestorDetailComponent),
            title: 'Investor Details – Pozz',
          },
          {
            path: 'investments',
            loadComponent: () =>
              import('./dashboard/investments/investments').then((m) => m.InvestmentsComponent),
            title: 'Investments – Pozz',
          },
          {
            path: 'investments/:id',
            loadComponent: () =>
              import('./dashboard/investments/investment-detail').then((m) => m.InvestmentDetailComponent),
            title: 'Investment Details – Pozz',
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./dashboard/projects/projects').then((m) => m.ProjectsComponent),
            title: 'Projects – Pozz',
          },
          {
            path: 'messages',
            loadComponent: () =>
              import('./dashboard/messages/messages').then((m) => m.MessagesComponent),
            title: 'Messages – Pozz',
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./dashboard/settings/settings').then((m) => m.SettingsComponent),
            title: 'Settings – Pozz',
          },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Fallback: redirect any unknown path to /en
  { path: '**', redirectTo: '/en' },
];
