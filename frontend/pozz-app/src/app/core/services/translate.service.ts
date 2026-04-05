import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type Locale = 'en' | 'ar';

const LOCALE_KEY = 'pozz_locale';
const SUPPORTED: Locale[] = ['en', 'ar'];

function detectInitialLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
  if (stored && SUPPORTED.includes(stored)) return stored;
  const browserLang = navigator.language.split('-')[0] as Locale;
  return SUPPORTED.includes(browserLang) ? browserLang : 'en';
}

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly http = inject(HttpClient);

  private readonly _locale = signal<Locale>(detectInitialLocale());
  private readonly _translations = signal<Record<string, unknown>>({});
  private readonly _ready = signal(false);

  /** The active locale — read in guards & components */
  readonly currentLocale = this._locale.asReadonly();
  readonly isRtl = computed(() => this._locale() === 'ar');
  readonly isReady = this._ready.asReadonly();

  /** Bootstrap: load translations for the stored / detected locale */
  async init(): Promise<void> {
    await this.loadTranslations(this._locale());
  }

  /** Called by locale guard when URL changes locale */
  async setLocale(locale: Locale): Promise<void> {
    if (locale === this._locale() && this._ready()) return;
    this._locale.set(locale);
    localStorage.setItem(LOCALE_KEY, locale);
    await this.loadTranslations(locale);
    this.applyToDocument(locale);
  }

  /** Translate a dot-notation key, supports {{param}} interpolation */
  t(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let value: unknown = this._translations();
    for (const k of keys) {
      if (typeof value !== 'object' || value === null) return key;
      value = (value as Record<string, unknown>)[k];
    }
    let result = typeof value === 'string' ? value : key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      }
    }
    return result;
  }

  private async loadTranslations(locale: Locale): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<Record<string, unknown>>(`/i18n/${locale}.json`),
      );
      this._translations.set(data);
      this._ready.set(true);
    } catch {
      console.error(`[i18n] Failed to load translations for "${locale}"`);
    }
  }

  private applyToDocument(locale: Locale): void {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }
}
