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
  readonly translate = inject(TranslateService);

  get locale(): string {
    return this.translate.currentLocale();
  }

  readonly navItems = [
    {
      labelKey: 'nav.dashboard',
      route: () => `/${this.locale}/dashboard`,
      exact: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 1 1 16 0A8 8 0 0 1 2 10Zm8-5a5 5 0 1 0 0 10A5 5 0 0 0 10 5Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></svg>',
    },
    {
      labelKey: 'nav.projects',
      route: () => `/${this.locale}/dashboard/projects`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26c.313-.141.65-.22 1-.257V4.75c0-.138.112-.25.25-.25h5.5c.138 0 .25.112.25.25v3.75h4.25c.414 0 .75.336.75.75v5.25c0 .138-.112.25-.25.25H3.25a.25.25 0 0 1-.25-.25V13.5H1.5v.75A1.75 1.75 0 0 0 3.25 16h13.5A1.75 1.75 0 0 0 18.5 14.25V9.25A1.75 1.75 0 0 0 16.75 7.5H10.5V4.75A1.75 1.75 0 0 0 8.75 3h-5Z"/></svg>',
    },
    {
      labelKey: 'nav.messages',
      route: () => `/${this.locale}/dashboard/messages`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.505 2.365A41.369 41.369 0 0 1 9 2c1.863 0 3.697.124 5.495.365 1.247.167 2.255 1.08 2.692 2.186.554-.077 1.078-.232 1.56-.456A4.5 4.5 0 0 0 14.5 2h-9A4.5 4.5 0 0 0 1.253 4.095c.482.224 1.006.379 1.56.456.437-1.105 1.445-2.02 2.692-2.186ZM1.5 7.5A3.5 3.5 0 0 1 5 4h10a3.5 3.5 0 0 1 3.5 3.5v6A3.5 3.5 0 0 1 15 17H5a3.5 3.5 0 0 1-3.5-3.5v-6Z"/></svg>',
    },
    {
      labelKey: 'nav.settings',
      route: () => `/${this.locale}/dashboard/settings`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd"/></svg>',
    },
  ];

  logout(): void {
    this.authService.logout();
  }
}
