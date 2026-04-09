import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/proposals`;

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';

export interface Proposal {
  id: number;
  companyId: number;
  investorId: number;
  investorName: string;
  projectId: number;
  projectName: string;
  title: string;
  description: string;
  amount: number;
  equityOffered: number;
  valuation: number;
  status: ProposalStatus;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface CreateProposalDto {
  investorId: number;
  projectId: number;
  title: string;
  description: string;
  amount: number;
  equityOffered: number;
  valuation: number;
}

@Injectable({ providedIn: 'root' })
export class ProposalService {
  private readonly http = inject(HttpClient);

  getAll(companyId: number, status?: ProposalStatus): Observable<Proposal[]> {
    let params: any = { companyId };
    if (status) params.status = status;
    return this.http.get<Proposal[]>(API_BASE, { params });
  }

  getById(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${API_BASE}/${id}`);
  }

  create(companyId: number, dto: CreateProposalDto): Observable<Proposal> {
    return this.http.post<Proposal>(API_BASE, { ...dto, companyId });
  }

  update(id: number, dto: Partial<CreateProposalDto>): Observable<Proposal> {
    return this.http.put<Proposal>(`${API_BASE}/${id}`, dto);
  }

  send(id: number): Observable<Proposal> {
    return this.http.post<Proposal>(`${API_BASE}/${id}/send`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }
}
