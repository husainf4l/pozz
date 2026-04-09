import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/activities`;

export type ActivityAction = 'created' | 'updated' | 'deleted' | 'shared' | 'commented';
export type ActivityEntityType = 'investor' | 'project' | 'meeting' | 'deal' | 'note' | 'document';

export interface Activity {
  id: number;
  companyId: number;
  userId: number;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: number;
  entityName: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  actor: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly http = inject(HttpClient);

  getAll(companyId: number, entityType?: ActivityEntityType): Observable<Activity[]> {
    let params: any = { companyId };
    if (entityType) params.entityType = entityType;
    return this.http.get<Activity[]>(API_BASE, { params });
  }

  getByEntity(entityType: ActivityEntityType, entityId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${API_BASE}/entity`, {
      params: { entityType, entityId }
    });
  }
}
