import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/workflows`;

export type TriggerType = 'investor_added' | 'investment_received' | 'project_updated' | 'meeting_scheduled' | 'document_uploaded';
export type ActionType = 'send_email' | 'create_task' | 'send_notification' | 'update_status' | 'create_activity';

export interface Workflow {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  isActive: boolean;
  trigger: {
    type: TriggerType;
    config: Record<string, any>;
  };
  actions: {
    type: ActionType;
    config: Record<string, any>;
  }[];
  createdAt: string;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  trigger: {
    type: TriggerType;
    config: Record<string, any>;
  };
  actions: {
    type: ActionType;
    config: Record<string, any>;
  }[];
}

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private readonly http = inject(HttpClient);

  getAll(companyId: number): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(API_BASE, { params: { companyId } });
  }

  getById(id: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${API_BASE}/${id}`);
  }

  create(companyId: number, dto: CreateWorkflowDto): Observable<Workflow> {
    return this.http.post<Workflow>(API_BASE, { ...dto, companyId });
  }

  update(id: number, dto: Partial<CreateWorkflowDto>): Observable<Workflow> {
    return this.http.put<Workflow>(`${API_BASE}/${id}`, dto);
  }

  toggle(id: number): Observable<Workflow> {
    return this.http.patch<Workflow>(`${API_BASE}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }
}
