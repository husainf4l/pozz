import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserInfo,
  OnboardingSummary,
} from '../models/auth.models';
import { TranslateService } from './translate.service';
import { environment } from '../../../environments/environment';

const ACCESS_TOKEN_KEY = 'pozz_access_token';
const REFRESH_TOKEN_KEY = 'pozz_refresh_token';
const USER_KEY = 'pozz_user';
const ONBOARDING_KEY = 'pozz_onboarding';
const API_BASE = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  private readonly _currentUser = signal<UserInfo | null>(this.loadUser());
  private readonly _onboarding = signal<OnboardingSummary | null>(this.loadOnboarding());

  readonly currentUser = this._currentUser.asReadonly();
  readonly onboarding = this._onboarding.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, request).pipe(
      tap((res) => {
        this.persistSession(res);
        this.navigateAfterAuth(res.onboarding);
      }),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/register`, request).pipe(
      tap((res) => {
        this.persistSession(res);
        this.navigateAfterAuth(res.onboarding);
      }),
    );
  }

  logout(): void {
    const locale = this.translate.currentLocale();
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      this.http.post(`${API_BASE}/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
    this.clearSession();
    this.router.navigate([`/${locale}/auth/login`]);
  }

  /** Called after completing an onboarding step so guards/redirects stay in sync. */
  updateOnboarding(summary: OnboardingSummary): void {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(summary));
    this._onboarding.set(summary);
  }

  /** Update the current user info (e.g., after profile update) */
  updateCurrentUser(user: UserInfo): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private navigateAfterAuth(onboarding: OnboardingSummary): void {
    const locale = this.translate.currentLocale();
    if (onboarding.role === 'Unknown' || onboarding.isComplete) {
      this.router.navigate([`/${locale}/dashboard`]);
    } else {
      this.router.navigate([`/${locale}/onboarding`]);
    }
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(res.onboarding));
    this._currentUser.set(res.user);
    this._onboarding.set(res.onboarding);
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    this._currentUser.set(null);
    this._onboarding.set(null);
  }

  private loadUser(): UserInfo | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserInfo) : null;
    } catch {
      return null;
    }
  }

  private loadOnboarding(): OnboardingSummary | null {
    try {
      const raw = localStorage.getItem(ONBOARDING_KEY);
      return raw ? (JSON.parse(raw) as OnboardingSummary) : null;
    } catch {
      return null;
    }
  }
}
