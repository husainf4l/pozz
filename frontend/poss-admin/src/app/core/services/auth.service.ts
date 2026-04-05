import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, UserInfo } from '../models/auth.models';
import { environment } from '../../../environments/environment';

const ACCESS_TOKEN_KEY  = 'pozz_admin_access_token';
const REFRESH_TOKEN_KEY = 'pozz_admin_refresh_token';
const USER_KEY          = 'pozz_admin_user';

const ADMIN_ROLES = ['SuperAdmin', 'Admin'];
const API_BASE = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<UserInfo | null>(this.loadUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn  = computed(() => this._currentUser() !== null);

  /** True only when the logged-in user has an admin-level role. */
  readonly isAdmin = computed(() => {
    const user = this._currentUser();
    return user?.roles.some((r) => ADMIN_ROLES.includes(r)) ?? false;
  });

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, request).pipe(
      tap((res) => {
        const hasAdmin = res.user.roles.some((r) => ADMIN_ROLES.includes(r));
        if (!hasAdmin) {
          throw new Error('ACCESS_DENIED');
        }
        this.persistSession(res);
        this.router.navigate(['/en/dashboard']);
      }),
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      this.http.post(`${API_BASE}/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
    this.clearSession();
    this.router.navigate(['/en/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._currentUser.set(res.user);
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  private loadUser(): UserInfo | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserInfo) : null;
    } catch {
      return null;
    }
  }
}
