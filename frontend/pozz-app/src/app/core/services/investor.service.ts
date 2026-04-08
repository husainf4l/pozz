import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Investor,
  InvestorListItem,
  CreateInvestorRequest,
  UpdateInvestorRequest,
  InvestorSearchRequest,
  PagedResult,
} from '../models/investor.models';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/investors`;

@Injectable({ providedIn: 'root' })
export class InvestorService {
  private readonly http = inject(HttpClient);

  // Signal to store investors list for reactive updates
  private readonly _investors = signal<InvestorListItem[]>([]);
  readonly investors = this._investors.asReadonly();

  /**
   * Get all investors with simple pagination.
   */
  getAll(page: number = 1, pageSize: number = 20, companyId?: number): Observable<InvestorListItem[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (companyId) {
      params = params.set('companyId', companyId.toString());
    }
    
    return this.http.get<InvestorListItem[]>(API_BASE, { params });
  }

  /**
   * Search investors with advanced filtering and sorting.
   */
  search(request: InvestorSearchRequest): Observable<PagedResult<InvestorListItem>> {
    let params = new HttpParams();
    
    if (request.companyId) params = params.set('companyId', request.companyId.toString());
    if (request.pipelineStage !== undefined) params = params.set('pipelineStage', request.pipelineStage.toString());
    if (request.investorType !== undefined) params = params.set('investorType', request.investorType.toString());
    if (request.priority !== undefined) params = params.set('priority', request.priority.toString());
    if (request.isActive !== undefined) params = params.set('isActive', request.isActive.toString());
    if (request.searchTerm) params = params.set('searchTerm', request.searchTerm);
    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    if (request.sortDirection) params = params.set('sortDirection', request.sortDirection);
    if (request.page) params = params.set('page', request.page.toString());
    if (request.pageSize) params = params.set('pageSize', request.pageSize.toString());
    
    return this.http.get<PagedResult<InvestorListItem>>(`${API_BASE}/search`, { params }).pipe(
      tap((result) => this._investors.set(result.items)),
    );
  }

  /**
   * Get a single investor by ID with full details.
   */
  getById(id: number): Observable<Investor> {
    return this.http.get<Investor>(`${API_BASE}/${id}`);
  }

  /**
   * Get investor by user ID.
   */
  getByUserId(userId: number): Observable<Investor> {
    return this.http.get<Investor>(`${API_BASE}/by-user/${userId}`);
  }

  /**
   * Create a new investor.
   */
  create(request: CreateInvestorRequest): Observable<Investor> {
    return this.http.post<Investor>(API_BASE, request).pipe(
      tap((investor) => {
        // Optionally refresh the list after creation
        // For now, we'll just add to the signal if it's a list item
        const listItem: InvestorListItem = {
          id: investor.id,
          userFullName: investor.userFullName,
          userEmail: investor.userEmail,
          primaryPhone: investor.primaryPhone,
          position: investor.position,
          investorType: investor.investorType,
          pipelineStage: investor.pipelineStage,
          potentialInvestmentAmount: investor.potentialInvestmentAmount,
          lastContactDate: investor.lastContactDate,
          nextFollowUpDate: investor.nextFollowUpDate,
          priority: investor.priority,
          isActive: investor.isActive,
        };
        this._investors.update((investors) => [listItem, ...investors]);
      }),
    );
  }

  /**
   * Update an existing investor.
   */
  update(id: number, request: UpdateInvestorRequest): Observable<Investor> {
    return this.http.put<Investor>(`${API_BASE}/${id}`, request).pipe(
      tap((updated) => {
        // Update the investor in the signal list
        this._investors.update((investors) =>
          investors.map((inv) =>
            inv.id === id
              ? {
                  id: updated.id,
                  userFullName: updated.userFullName,
                  userEmail: updated.userEmail,
                  primaryPhone: updated.primaryPhone,
                  position: updated.position,
                  investorType: updated.investorType,
                  pipelineStage: updated.pipelineStage,
                  potentialInvestmentAmount: updated.potentialInvestmentAmount,
                  lastContactDate: updated.lastContactDate,
                  nextFollowUpDate: updated.nextFollowUpDate,
                  priority: updated.priority,
                  isActive: updated.isActive,
                }
              : inv,
          ),
        );
      }),
    );
  }

  /**
   * Delete (soft delete) an investor.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`).pipe(
      tap(() => {
        this._investors.update((investors) => investors.filter((inv) => inv.id !== id));
      }),
    );
  }

  /**
   * Clear the investors signal (useful for cleanup).
   */
  clearInvestors(): void {
    this._investors.set([]);
  }
}
