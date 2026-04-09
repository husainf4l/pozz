import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/calendar`;

export type CalendarEventType = 'meeting' | 'deadline' | 'reminder' | 'other';

export interface CalendarEvent {
  id: number;
  companyId: number;
  title: string;
  description?: string;
  type: CalendarEventType;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: number[];
  createdAt: string;
}

export interface CreateCalendarEventDto {
  title: string;
  description?: string;
  type: CalendarEventType;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: number[];
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly http = inject(HttpClient);

  getEvents(companyId: number, start?: string, end?: string): Observable<CalendarEvent[]> {
    let params: any = { companyId };
    if (start) params.start = start;
    if (end) params.end = end;
    return this.http.get<CalendarEvent[]>(`${API_BASE}/events`, { params });
  }

  create(companyId: number, dto: CreateCalendarEventDto): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${API_BASE}/events`, { ...dto, companyId });
  }

  update(id: number, dto: Partial<CreateCalendarEventDto>): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${API_BASE}/events/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/events/${id}`);
  }

  syncWithGoogle(): Observable<void> {
    return this.http.post<void>(`${API_BASE}/sync/google`, {});
  }
}
