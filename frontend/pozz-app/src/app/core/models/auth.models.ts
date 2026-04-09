export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Investor' | 'ProjectOwner';
}

export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  companyId?: number;
}

export interface OnboardingSummary {
  isComplete: boolean;
  role: string; // "Investor" | "ProjectOwner" | "Unknown"
  status: string; // "NotStarted" | "InProgress" | "Completed"
  currentStep: string | null;
  currentStepLabel: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfo;
  onboarding: OnboardingSummary;
}
