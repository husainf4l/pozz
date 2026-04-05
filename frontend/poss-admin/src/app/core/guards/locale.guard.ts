import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslateService, Locale } from '../services/translate.service';

const SUPPORTED: Locale[] = ['en', 'ar'];

export const localeGuard: CanActivateFn = async (route) => {
  const router    = inject(Router);
  const translate = inject(TranslateService);

  const locale = route.paramMap.get('locale') as Locale | null;

  if (locale && SUPPORTED.includes(locale)) {
    await translate.setLocale(locale);
    return true;
  }

  const remainingUrl = route.url.map((s) => s.path).join('/');
  return router.createUrlTree(['/en', ...(remainingUrl ? [remainingUrl] : [])]);
};
