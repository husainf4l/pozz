export interface Project {
  id: number;
  title: string;
  description: string | null;
  summary: string | null;
  industry: string | null;
  location: string | null;
  fundingGoal: number;
  minimumInvestment: number;
  currentFunding: number;
  status: ProjectStatus;
  fundingDeadline: string | null;
  expectedReturn: number | null;
  durationMonths: number | null;
  imageUrl: string | null;
  documents: string | null;
  companyId: number;
  companyName: string;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  Draft = 0,
  Active = 1,
  Funded = 2,
  Closed = 3,
  Cancelled = 4,
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  summary?: string;
  industry?: string;
  location?: string;
  fundingGoal: number;
  minimumInvestment: number;
  fundingDeadline?: string;
  expectedReturn?: number;
  durationMonths?: number;
  imageUrl?: string;
  documents?: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  summary?: string;
  industry?: string;
  location?: string;
  fundingGoal?: number;
  minimumInvestment?: number;
  status?: ProjectStatus;
  fundingDeadline?: string;
  expectedReturn?: number;
  durationMonths?: number;
  imageUrl?: string;
  documents?: string;
  isActive?: boolean;
}
