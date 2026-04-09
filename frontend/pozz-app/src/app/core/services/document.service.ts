import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/documents`;

export interface Document {
  id: number;
  companyId: number;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  folderId?: number;
  uploadedBy: number;
  uploadedAt: string;
  version: number;
  tags: string[];
  sharedWith: number[];
}

export interface DocumentFolder {
  id: number;
  companyId: number;
  name: string;
  parentId?: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);

  getAll(companyId: number, folderId?: number): Observable<Document[]> {
    let params: any = { companyId };
    if (folderId) params.folderId = folderId;
    return this.http.get<Document[]>(API_BASE, { params });
  }

  upload(companyId: number, file: File, folderId?: number): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId.toString());
    if (folderId) formData.append('folderId', folderId.toString());
    return this.http.post<Document>(`${API_BASE}/upload`, formData);
  }

  share(id: number, userIds: number[]): Observable<Document> {
    return this.http.post<Document>(`${API_BASE}/${id}/share`, { userIds });
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${API_BASE}/${id}/download`, { responseType: 'blob' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }

  getFolders(companyId: number): Observable<DocumentFolder[]> {
    return this.http.get<DocumentFolder[]>(`${API_BASE}/folders`, { params: { companyId } });
  }

  createFolder(companyId: number, name: string, parentId?: number): Observable<DocumentFolder> {
    return this.http.post<DocumentFolder>(`${API_BASE}/folders`, { companyId, name, parentId });
  }
}
