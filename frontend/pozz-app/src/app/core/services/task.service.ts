import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/tasks`;

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  companyId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: number;
  relatedTo?: {
    type: 'investor' | 'project' | 'meeting';
    id: number;
    name: string;
  };
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedTo?: number;
  dueDate?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  getAll(companyId: number, status?: TaskStatus): Observable<Task[]> {
    let params: any = { companyId };
    if (status) params.status = status;
    return this.http.get<Task[]>(API_BASE, { params });
  }

  getUpcoming(companyId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_BASE}/upcoming`, { params: { companyId } });
  }

  create(companyId: number, dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(API_BASE, { ...dto, companyId });
  }

  update(id: number, dto: Partial<CreateTaskDto>): Observable<Task> {
    return this.http.put<Task>(`${API_BASE}/${id}`, dto);
  }

  complete(id: number): Observable<Task> {
    return this.http.patch<Task>(`${API_BASE}/${id}/complete`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }
}
