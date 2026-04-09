import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/search`;

export interface SearchResult {
  id: number;
  type: 'investor' | 'project' | 'meeting' | 'note';
  title: string;
  subtitle?: string;
  url: string;
}

export interface SearchResults {
  investors: SearchResult[];
  projects: SearchResult[];
  meetings: SearchResult[];
  notes: SearchResult[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);

  globalSearch(companyId: number, query: string): Observable<SearchResults> {
    return this.http.get<SearchResults>(`${API_BASE}/global`, {
      params: { companyId, query }
    });
  }

  searchInvestors(companyId: number, query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${API_BASE}/investors`, {
      params: { companyId, query }
    });
  }

  searchProjects(companyId: number, query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${API_BASE}/projects`, {
      params: { companyId, query }
    });
  }

  searchMeetings(companyId: number, query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${API_BASE}/meetings`, {
      params: { companyId, query }
    });
  }

  searchNotes(companyId: number, query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${API_BASE}/notes`, {
      params: { companyId, query }
    });
  }
}
