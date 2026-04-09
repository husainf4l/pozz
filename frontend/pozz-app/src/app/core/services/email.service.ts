import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/emails`;

export type EmailStatus = 'draft' | 'sent' | 'opened' | 'clicked' | 'replied';

export interface Email {
  id: number;
  companyId: number;
  subject: string;
  body: string;
  recipients: string[];
  status: EmailStatus;
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
  templateId?: number;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export interface SendEmailDto {
  subject: string;
  body: string;
  recipients: string[];
  templateId?: number;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly http = inject(HttpClient);

  send(companyId: number, dto: SendEmailDto): Observable<Email> {
    return this.http.post<Email>(`${API_BASE}/send`, { ...dto, companyId });
  }

  getTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`${API_BASE}/templates`);
  }

  getAll(companyId: number): Observable<Email[]> {
    return this.http.get<Email[]>(API_BASE, { params: { companyId } });
  }

  getTracking(id: number): Observable<Email> {
    return this.http.get<Email>(`${API_BASE}/${id}/tracking`);
  }
}
