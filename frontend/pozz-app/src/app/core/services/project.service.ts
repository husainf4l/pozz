import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models/project.models';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/projects`;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);

  private readonly _myProjects = signal<Project[]>([]);
  readonly myProjects = this._myProjects.asReadonly();

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(API_BASE);
  }

  getActiveProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_BASE}/active`);
  }

  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_BASE}/my-projects`).pipe(
      tap((projects) => this._myProjects.set(projects)),
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${API_BASE}/${id}`);
  }

  createProject(request: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(API_BASE, request).pipe(
      tap((project) => {
        this._myProjects.update((projects) => [project, ...projects]);
      }),
    );
  }

  updateProject(id: number, request: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${API_BASE}/${id}`, request).pipe(
      tap((updated) => {
        this._myProjects.update((projects) =>
          projects.map((p) => (p.id === id ? updated : p)),
        );
      }),
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`).pipe(
      tap(() => {
        this._myProjects.update((projects) => projects.filter((p) => p.id !== id));
      }),
    );
  }
}
