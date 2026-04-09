import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { TranslateService } from '../core/services/translate.service';
import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle';
import { LangSwitcherComponent } from '../shared/lang-switcher/lang-switcher';
import { NotificationsDropdownComponent } from '../shared/notifications-dropdown/notifications-dropdown';
import { GlobalSearchComponent } from '../shared/global-search/global-search';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe, ThemeToggleComponent, LangSwitcherComponent, NotificationsDropdownComponent, GlobalSearchComponent],
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
      labelKey: 'nav.investors',
      route: () => `/${this.locale}/dashboard/investors`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z"/></svg>',
    },
    {
      labelKey: 'nav.investments',
      route: () => `/${this.locale}/dashboard/investments`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 0 0 1.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A5.205 5.205 0 0 0 6.83 8H5.75a.75.75 0 0 0 0 1.5h.77a6.333 6.333 0 0 0 0 1h-.77a.75.75 0 0 0 0 1.5h1.08c.183.528.442 1.023.776 1.46.757.99 1.798 1.54 2.894 1.54s2.137-.55 2.894-1.54a.75.75 0 0 0-1.192-.91c-.512.67-1.135.95-1.702.95s-1.19-.28-1.702-.95a3.505 3.505 0 0 1-.343-.55h1.795a.75.75 0 0 0 0-1.5H8.026a4.835 4.835 0 0 1 0-1h2.224a.75.75 0 0 0 0-1.5H8.455c.098-.195.212-.38.343-.55Z" clip-rule="evenodd"/></svg>',
    },
    {
      labelKey: 'nav.projects',
      route: () => `/${this.locale}/dashboard/projects`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26c.313-.141.65-.22 1-.257V4.75c0-.138.112-.25.25-.25h5.5c.138 0 .25.112.25.25v3.75h4.25c.414 0 .75.336.75.75v5.25c0 .138-.112.25-.25.25H3.25a.25.25 0 0 1-.25-.25V13.5H1.5v.75A1.75 1.75 0 0 0 3.25 16h13.5A1.75 1.75 0 0 0 18.5 14.25V9.25A1.75 1.75 0 0 0 16.75 7.5H10.5V4.75A1.75 1.75 0 0 0 8.75 3h-5Z"/></svg>',
    },
    {
      labelKey: 'nav.tasks',
      route: () => `/${this.locale}/dashboard/tasks`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>',
    },
    {
      labelKey: 'nav.documents',
      route: () => `/${this.locale}/dashboard/documents`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>',
    },
    {
      labelKey: 'nav.calendar',
      route: () => `/${this.locale}/dashboard/calendar`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z" clip-rule="evenodd"/></svg>',
    },
    {
      labelKey: 'nav.emails',
      route: () => `/${this.locale}/dashboard/emails`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>',
    },
    {
      labelKey: 'nav.captable',
      route: () => `/${this.locale}/dashboard/captable`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>',
    },
    {
      labelKey: 'nav.workflows',
      route: () => `/${this.locale}/dashboard/workflows`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>',
    },
    {
      labelKey: 'nav.proposals',
      route: () => `/${this.locale}/dashboard/proposals`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>',
    },
    {
      labelKey: 'nav.activity',
      route: () => `/${this.locale}/dashboard/activity`,
      exact: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>',
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
