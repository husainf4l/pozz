import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/captable`;

export type ShareholderType = 'founder' | 'investor' | 'employee' | 'advisor';

export interface Shareholder {
  id: number;
  name: string;
  type: ShareholderType;
  shares: number;
  percentageOwnership: number;
  investmentAmount?: number;
  joinedDate: string;
}

export interface EquityRound {
  id: number;
  name: string;
  amount: number;
  valuation: number;
  date: string;
  investors: number;
}

export interface CapTable {
  companyId: number;
  totalShares: number;
  postMoneyValuation: number;
  shareholders: Shareholder[];
  rounds: EquityRound[];
}

export interface CreateShareholderDto {
  name: string;
  type: ShareholderType;
  shares: number;
  investmentAmount?: number;
}

export interface CreateRoundDto {
  name: string;
  amount: number;
  valuation: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class CapTableService {
  private readonly http = inject(HttpClient);

  get(companyId: number): Observable<CapTable> {
    return this.http.get<CapTable>(`${API_BASE}/${companyId}`);
  }

  addShareholder(companyId: number, dto: CreateShareholderDto): Observable<Shareholder> {
    return this.http.post<Shareholder>(`${API_BASE}/${companyId}/shareholders`, dto);
  }

  updateShareholder(companyId: number, id: number, dto: Partial<CreateShareholderDto>): Observable<Shareholder> {
    return this.http.put<Shareholder>(`${API_BASE}/${companyId}/shareholders/${id}`, dto);
  }

  removeShareholder(companyId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${companyId}/shareholders/${id}`);
  }

  addRound(companyId: number, dto: CreateRoundDto): Observable<EquityRound> {
    return this.http.post<EquityRound>(`${API_BASE}/${companyId}/rounds`, dto);
  }

  simulate(companyId: number, newInvestment: number, newValuation: number): Observable<CapTable> {
    return this.http.post<CapTable>(`${API_BASE}/${companyId}/simulate`, { newInvestment, newValuation });
  }
}
