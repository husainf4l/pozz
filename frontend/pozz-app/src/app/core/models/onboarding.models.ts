export interface OnboardingStep {
  key: string;
  label: string;
  isCompleted: boolean;
  isRequired: boolean;
  isCurrent: boolean;
}

export interface OnboardingStatus {
  role: string; // "Investor" | "ProjectOwner"
  status: string; // "NotStarted" | "InProgress" | "Completed"
  isComplete: boolean;
  currentStep: string | null;
  currentStepLabel: string | null;
  steps: OnboardingStep[];
  completedAt: string | null;
}

export interface PersonalInfoRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  country?: string;
}

export interface InvestorProfileRequest {
  investorType: string;
  investmentBudgetRange?: string;
  investmentInterests: string[];
  linkedInProfile?: string;
}

export interface CompanySetupRequest {
  companyName: string;
  registrationNumber?: string;
  industry?: string;
  taxNumber?: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
}

export interface CompanyDetailsRequest {
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  taxNumber?: string;
}
