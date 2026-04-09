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
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./dashboard/investors/investors').then((m) => m.InvestorsComponent),
                title: 'Investors – Pozz',
              },
              {
                path: 'new',
                loadComponent: () =>
                  import('./dashboard/investors/investor-form').then((m) => m.InvestorFormComponent),
                title: 'Add Investor – Pozz',
              },
              {
                path: ':id/edit',
                loadComponent: () =>
                  import('./dashboard/investors/investor-form').then((m) => m.InvestorFormComponent),
                title: 'Edit Investor – Pozz',
              },
              {
                path: ':id',
                loadComponent: () =>
                  import('./dashboard/investors/investor-detail').then((m) => m.InvestorDetailComponent),
                title: 'Investor Details – Pozz',
              },
            ],
          },
          {
            path: 'investments',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./dashboard/investments/investments').then((m) => m.InvestmentsComponent),
                title: 'Investments – Pozz',
              },
              {
                path: 'new',
                loadComponent: () =>
                  import('./dashboard/investments/investment-form').then((m) => m.InvestmentFormComponent),
                title: 'Record Investment – Pozz',
              },
              {
                path: ':id/edit',
                loadComponent: () =>
                  import('./dashboard/investments/investment-form').then((m) => m.InvestmentFormComponent),
                title: 'Edit Investment – Pozz',
              },
              {
                path: ':id',
                loadComponent: () =>
                  import('./dashboard/investments/investment-detail').then((m) => m.InvestmentDetailComponent),
                title: 'Investment Details – Pozz',
              },
            ],
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./dashboard/projects/projects').then((m) => m.ProjectsComponent),
            title: 'Projects – Pozz',
          },
          {
            path: 'tasks',
            loadComponent: () =>
              import('./dashboard/tasks/tasks').then((m) => m.TasksComponent),
            title: 'Tasks – Pozz',
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./dashboard/documents/documents').then((m) => m.DocumentsComponent),
            title: 'Documents – Pozz',
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./dashboard/calendar/calendar').then((m) => m.CalendarComponent),
            title: 'Calendar – Pozz',
          },
          {
            path: 'emails',
            loadComponent: () =>
              import('./dashboard/emails/emails').then((m) => m.EmailsComponent),
            title: 'Emails – Pozz',
          },
          {
            path: 'captable',
            loadComponent: () =>
              import('./dashboard/captable/captable').then((m) => m.CaptableComponent),
            title: 'Cap Table – Pozz',
          },
          {
            path: 'workflows',
            loadComponent: () =>
              import('./dashboard/workflows/workflows').then((m) => m.WorkflowsComponent),
            title: 'Workflows – Pozz',
          },
          {
            path: 'proposals',
            loadComponent: () =>
              import('./dashboard/proposals/proposals').then((m) => m.ProposalsComponent),
            title: 'Proposals – Pozz',
          },
          {
            path: 'activity',
            loadComponent: () =>
              import('./dashboard/activity/activity').then((m) => m.ActivityComponent),
            title: 'Activity – Pozz',
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./dashboard/notifications/notifications').then((m) => m.NotificationsComponent),
            title: 'Notifications – Pozz',
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
