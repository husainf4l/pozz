import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/notifications`;

export interface Notification {
  id: number;
  userId: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface CreateNotificationDto {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly _unreadCount = signal(0);
  readonly unreadCount = this._unreadCount.asReadonly();

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(API_BASE);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${API_BASE}/unread/count`).pipe(
      tap((res) => this._unreadCount.set(res.count))
    );
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${API_BASE}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${API_BASE}/mark-all-read`, {}).pipe(
      tap(() => this._unreadCount.set(0))
    );
  }

  create(dto: CreateNotificationDto): Observable<Notification> {
    return this.http.post<Notification>(API_BASE, dto);
  }
}
