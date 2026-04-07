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
  // Enhanced fields
  stage: ProjectStage | null;
  primaryGoal: ProjectGoal | null;
  websiteUrl: string | null;
  pitchDeckUrl: string | null;
  internalNotes: string | null;
  tags: string | null;
  targetMarket: string | null;
  businessModel: BusinessModel | null;
  currentStatusSummary: string | null;
}

export enum ProjectStatus {
  Draft = 0,
  Active = 1,
  Funded = 2,
  Closed = 3,
  Cancelled = 4,
}

export enum ProjectStage {
  Idea = 0,
  MVP = 1,
  EarlyRevenue = 2,
  Scaling = 3,
}

export enum ProjectGoal {
  RaiseFunding = 0,
  SellProject = 1,
  FindPartners = 2,
  StrategicInvestment = 3,
}

export enum BusinessModel {
  SaaS = 0,
  Marketplace = 1,
  ECommerce = 2,
  Subscription = 3,
  Other = 4,
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
  // Enhanced fields
  stage?: ProjectStage;
  primaryGoal?: ProjectGoal;
  websiteUrl?: string;
  pitchDeckUrl?: string;
  internalNotes?: string;
  tags?: string;
  targetMarket?: string;
  businessModel?: BusinessModel;
  currentStatusSummary?: string;
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
  // Enhanced fields
  stage?: ProjectStage;
  primaryGoal?: ProjectGoal;
  websiteUrl?: string;
  pitchDeckUrl?: string;
  internalNotes?: string;
  tags?: string;
  targetMarket?: string;
  businessModel?: BusinessModel;
  currentStatusSummary?: string;
}
