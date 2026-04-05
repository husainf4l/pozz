import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'pozz_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.loadStoredTheme());

  readonly theme = this._theme.asReadonly();

  /** Whether the resolved (actual) mode is dark */
  readonly isDark = computed(() => {
    const t = this._theme();
    if (t === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return t === 'dark';
  });

  /** Bootstrap: apply theme on app start */
  init(): void {
    this.applyTheme(this._theme());

    // React to OS-level changes when 'system' is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this._theme() === 'system') this.applyTheme('system');
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
  }

  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    const dark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }

  private loadStoredTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
