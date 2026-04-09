import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/settings`;

export interface UserSettings {
  userId: number;
  notifications: {
    email: boolean;
    push: boolean;
    investorUpdates: boolean;
    projectMilestones: boolean;
    teamActivity: boolean;
  };
  integrations: {
    googleCalendar?: {
      connected: boolean;
      email?: string;
    };
    outlook?: {
      connected: boolean;
      email?: string;
    };
    slack?: {
      connected: boolean;
      webhookUrl?: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);

  get(): Observable<UserSettings> {
    return this.http.get<UserSettings>(API_BASE);
  }

  update(settings: Partial<UserSettings>): Observable<UserSettings> {
    return this.http.put<UserSettings>(API_BASE, settings);
  }

  updateNotifications(notifications: UserSettings['notifications']): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${API_BASE}/notifications`, { notifications });
  }

  updateIntegrations(integrations: UserSettings['integrations']): Observable<UserSettings> {
    return this.http.patch<UserSettings>(`${API_BASE}/integrations`, { integrations });
  }
}
