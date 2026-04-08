import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileUploadResponse {
  key: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  context: string;
  isPublic: boolean;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE = `${environment.apiUrl}/files`;

  /**
   * Upload file to AWS S3 via backend
   * @param file File to upload
   * @param context Context for the upload (e.g., 'project-images', 'profile-avatars')
   */
  uploadFile(file: File, context: string = 'attachments'): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponse>(`${this.API_BASE}/upload?context=${context}`, formData);
  }

  /**
   * Upload image to AWS S3 (public context for project images)
   */
  uploadImage(file: File): Observable<FileUploadResponse> {
    return this.uploadFile(file, 'project-images');
  }

  /**
   * Delete file from S3
   */
  deleteFile(key: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/${encodeURIComponent(key)}`);
  }

  // Legacy method - kept for backward compatibility but no longer needed
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

