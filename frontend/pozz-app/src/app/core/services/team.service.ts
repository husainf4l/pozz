import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/team`;

export type TeamRole = 'admin' | 'member' | 'viewer';

export interface TeamMember {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole;
  joinedAt: string;
}

export interface InviteTeamMemberDto {
  email: string;
  role: TeamRole;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly http = inject(HttpClient);

  getMembers(companyId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${API_BASE}/${companyId}/members`);
  }

  invite(companyId: number, dto: InviteTeamMemberDto): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${API_BASE}/${companyId}/invite`, dto);
  }

  remove(companyId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${companyId}/members/${memberId}`);
  }

  updateRole(companyId: number, memberId: number, role: TeamRole): Observable<TeamMember> {
    return this.http.patch<TeamMember>(`${API_BASE}/${companyId}/members/${memberId}/role`, { role });
  }
}
