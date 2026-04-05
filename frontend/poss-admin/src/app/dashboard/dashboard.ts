import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { TranslateService } from '../core/services/translate.service';
import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle';
import { LangSwitcherComponent } from '../shared/lang-switcher/lang-switcher';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe, ThemeToggleComponent, LangSwitcherComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  readonly translate   = inject(TranslateService);

  get locale(): string { return this.translate.currentLocale(); }

  readonly navItems = [
    {
      labelKey: 'nav.overview',
      route: () => `/${this.locale}/dashboard`,
      exact: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 1 1 16 0A8 8 0 0 1 2 10Zm8-5a5 5 0 1 0 0 10A5 5 0 0 0 10 5Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></svg>`,
    },
    {
      labelKey: 'nav.users',
      route: () => `/${this.locale}/dashboard/users`,
      exact: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.aberration ZM14.5 16h.001Z"/></svg>`,
    },
    {
      labelKey: 'nav.companies',
      route: () => `/${this.locale}/dashboard/companies`,
      exact: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5H16v13h.25a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5H4Zm3-11a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 5.5Zm.75 2.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM7 11.5a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm4.75-5.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-.75 4.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm2.25-6a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z" clip-rule="evenodd"/></svg>`,
    },
    {
      labelKey: 'nav.projects',
      route: () => `/${this.locale}/dashboard/projects`,
      exact: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26c.313-.141.65-.22 1-.257V4.75c0-.138.112-.25.25-.25h5.5c.138 0 .25.112.25.25v3.75h4.25c.414 0 .75.336.75.75v5.25c0 .138-.112.25-.25.25H3.25a.25.25 0 0 1-.25-.25V13.5H1.5v.75A1.75 1.75 0 0 0 3.25 16h13.5A1.75 1.75 0 0 0 18.5 14.25V9.25A1.75 1.75 0 0 0 16.75 7.5H10.5V4.75A1.75 1.75 0 0 0 8.75 3h-5Z"/></svg>`,
    },
    {
      labelKey: 'nav.investments',
      route: () => `/${this.locale}/dashboard/investments`,
      exact: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H18v8.75A2.75 2.75 0 0 1 15.25 15h-1.072l.798 3.06a.75.75 0 0 1-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 0 1-1.452-.38L5.823 15H4.75A2.75 2.75 0 0 1 2 12.25V3.5h-.25A.75.75 0 0 1 1 2.75ZM7.373 15l-.54 2.07h6.334L12.627 15H7.373ZM11.25 5a.75.75 0 1 0-1.5 0v4.25H6.5a.75.75 0 0 0 0 1.5h3.25v.25a.75.75 0 0 0 1.5 0v-.25h1.25a.75.75 0 0 0 0-1.5H11.25V5Z" clip-rule="evenodd"/></svg>`,
    },
    {
      labelKey: 'nav.settings',
      route: () => `/${this.locale}/dashboard/settings`,
      exact: false,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd"/></svg>`,
    },
  ];

  logout(): void { this.authService.logout(); }
}
