import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="switch()"
      class="flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      [attr.aria-label]="translate.currentLocale() === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3.5 shrink-0">
        <path fill-rule="evenodd" d="M7.172 2a.75.75 0 0 1 .75.75V4h4.5V2.75a.75.75 0 0 1 1.5 0V4H15a.75.75 0 0 1 0 1.5h-.61l-.498 5.53A5.25 5.25 0 0 1 6.246 16.5H5a.75.75 0 0 1 0-1.5h1.246a3.75 3.75 0 0 0 3.726-3.264L10.48 5.5H7.086l.414 4.596a.75.75 0 1 1-1.496.134l-.43-4.73H5a.75.75 0 0 1 0-1.5h.828a.75.75 0 0 1 .172.01V2.75A.75.75 0 0 1 7.172 2Zm5.664 10.598a3.75 3.75 0 0 0-3.455 2.302.75.75 0 0 1-1.382-.58 5.25 5.25 0 0 1 9.674 0 .75.75 0 1 1-1.382.58 3.75 3.75 0 0 0-3.455-2.302Z" clip-rule="evenodd" />
      </svg>
      {{ translate.currentLocale() === 'en' ? 'عربي' : 'EN' }}
    </button>
  `,
})
export class LangSwitcherComponent {
  readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  switch(): void {
    const next = this.translate.currentLocale() === 'en' ? 'ar' : 'en';
    const url  = this.router.url;
    this.router.navigateByUrl(url.replace(/^\/(en|ar)(\/|$)/, `/${next}$2`));
  }
}
