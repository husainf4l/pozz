import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Investment,
  InvestmentListItem,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  InvestmentSearchRequest,
  PagedResult,
} from '../models/investment.models';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/investments`;

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private readonly http = inject(HttpClient);

  // Signal to store investments list for reactive updates
  private readonly _investments = signal<InvestmentListItem[]>([]);
  readonly investments = this._investments.asReadonly();

  /**
   * Get all investments with simple pagination.
   */
  getAll(page: number = 1, pageSize: number = 20, companyId?: number): Observable<InvestmentListItem[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (companyId) {
      params = params.set('companyId', companyId.toString());
    }
    
    return this.http.get<InvestmentListItem[]>(API_BASE, { params });
  }

  /**
   * Search investments with advanced filtering and sorting.
   */
  search(request: InvestmentSearchRequest): Observable<PagedResult<InvestmentListItem>> {
    let params = new HttpParams();
    
    if (request.companyId) params = params.set('companyId', request.companyId.toString());
    if (request.investorId) params = params.set('investorId', request.investorId.toString());
    if (request.projectId) params = params.set('projectId', request.projectId.toString());
    if (request.paymentStatus !== undefined) params = params.set('paymentStatus', request.paymentStatus.toString());
    if (request.status !== undefined) params = params.set('status', request.status.toString());
    if (request.instrument !== undefined) params = params.set('instrument', request.instrument.toString());
    if (request.searchTerm) params = params.set('searchTerm', request.searchTerm);
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    if (request.sortDirection) params = params.set('sortDirection', request.sortDirection);
    if (request.page) params = params.set('page', request.page.toString());
    if (request.pageSize) params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<InvestmentListItem>>(`${API_BASE}/search`, { params }).pipe(
      tap((result) => this._investments.set(result.items)),
    );
  }

  /**
   * Get a single investment by ID with full details.
   */
  getById(id: number): Observable<Investment> {
    return this.http.get<Investment>(`${API_BASE}/${id}`);
  }

  /**
   * Get all investments for a specific investor.
   */
  getByInvestorId(investorId: number, page: number = 1, pageSize: number = 20): Observable<PagedResult<InvestmentListItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<InvestmentListItem>>(`${API_BASE}/by-investor/${investorId}`, { params });
  }

  /**
   * Get all investments for a specific project.
   */
  getByProjectId(projectId: number, page: number = 1, pageSize: number = 20): Observable<PagedResult<InvestmentListItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PagedResult<InvestmentListItem>>(`${API_BASE}/by-project/${projectId}`, { params });
  }

  /**
   * Get total raised amount for a company.
   */
  getTotalRaised(companyId: number): Observable<{ totalRaised: number }> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<{ totalRaised: number }>(`${API_BASE}/total-raised`, { params });
  }

  /**
   * Create a new investment.
   */
  create(request: CreateInvestmentRequest): Observable<Investment> {
    return this.http.post<Investment>(API_BASE, request).pipe(
      tap((investment) => {
        // Add to the signal list
        const listItem: InvestmentListItem = {
          id: investment.id,
          investorName: investment.investorName,
          projectName: investment.projectName,
          committedAmount: investment.committedAmount,
          paidAmount: investment.paidAmount,
          remainingAmount: investment.remainingAmount,
          equityPercentage: investment.equityPercentage,
          instrument: investment.instrument,
          paymentStatus: investment.paymentStatus,
          commitmentDate: investment.commitmentDate,
          closingDate: investment.closingDate,
          status: investment.status,
        };
        this._investments.update((investments) => [listItem, ...investments]);
      }),
    );
  }

  /**
   * Update an existing investment.
   */
  update(id: number, request: UpdateInvestmentRequest): Observable<Investment> {
    return this.http.put<Investment>(`${API_BASE}/${id}`, request).pipe(
      tap((updated) => {
        // Update the investment in the signal list
        this._investments.update((investments) =>
          investments.map((inv) =>
            inv.id === id
              ? {
                  id: updated.id,
                  investorName: updated.investorName,
                  projectName: updated.projectName,
                  committedAmount: updated.committedAmount,
                  paidAmount: updated.paidAmount,
                  remainingAmount: updated.remainingAmount,
                  equityPercentage: updated.equityPercentage,
                  instrument: updated.instrument,
                  paymentStatus: updated.paymentStatus,
                  commitmentDate: updated.commitmentDate,
                  closingDate: updated.closingDate,
                  status: updated.status,
                }
              : inv,
          ),
        );
      }),
    );
  }

  /**
   * Delete (soft delete) an investment.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`).pipe(
      tap(() => {
        this._investments.update((investments) => investments.filter((inv) => inv.id !== id));
      }),
    );
  }

  /**
   * Clear the investments signal (useful for cleanup).
   */
  clearInvestments(): void {
    this._investments.set([]);
  }
}
