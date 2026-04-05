import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../services/translate.service';

/**
 * Impure pipe so it re-evaluates when locale/translations signal changes.
 *
 * Usage:
 *   {{ 'auth.login.title' | t }}
 *   {{ 'dashboard.welcome' | t: { name: firstName } }}
 */
@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(key: string, params?: Record<string, string>): string {
    return this.translate.t(key, params);
  }
}
