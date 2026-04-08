import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/users`;

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  isActive?: boolean;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  /**
   * Update the current user's profile.
   */
  updateProfile(request: UpdateUserProfileRequest): Observable<UserDto> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('No user logged in');

    return this.http.put<UserDto>(`${API_BASE}/${user.id}`, {
      firstName: request.firstName,
      lastName: request.lastName,
      isActive: request.isActive ?? true,
    }).pipe(
      tap((updated) => {
        // Update the user in localStorage and signal
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: updated.firstName,
            lastName: updated.lastName,
          };
          localStorage.setItem('pozz_user', JSON.stringify(updatedUser));
          // Note: We'd need to expose a method in AuthService to update the signal
          // For now, the user would see the update after page refresh
        }
      }),
    );
  }

  /**
   * Get user by ID.
   */
  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${API_BASE}/${id}`);
  }
}
