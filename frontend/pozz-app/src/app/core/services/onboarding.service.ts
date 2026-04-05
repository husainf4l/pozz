import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OnboardingStatus,
  PersonalInfoRequest,
  InvestorProfileRequest,
  CompanySetupRequest,
  CompanyDetailsRequest,
} from '../models/onboarding.models';
import { environment } from '../../../environments/environment';

const API_BASE = `${environment.apiUrl}/onboarding`;

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly http = inject(HttpClient);

  getStatus(): Observable<OnboardingStatus> {
    return this.http.get<OnboardingStatus>(`${API_BASE}/status`);
  }

  completePersonalInfo(data: PersonalInfoRequest): Observable<OnboardingStatus> {
    return this.http.post<OnboardingStatus>(`${API_BASE}/personal-info`, data);
  }

  completeInvestorProfile(data: InvestorProfileRequest): Observable<OnboardingStatus> {
    return this.http.post<OnboardingStatus>(`${API_BASE}/investor-profile`, data);
  }

  completeCompanySetup(data: CompanySetupRequest): Observable<OnboardingStatus> {
    return this.http.post<OnboardingStatus>(`${API_BASE}/company-setup`, data);
  }

  completeCompanyDetails(data: CompanyDetailsRequest): Observable<OnboardingStatus> {
    return this.http.post<OnboardingStatus>(`${API_BASE}/company-details`, data);
  }

  acceptTerms(): Observable<OnboardingStatus> {
    return this.http.post<OnboardingStatus>(`${API_BASE}/accept-terms`, {});
  }
}
