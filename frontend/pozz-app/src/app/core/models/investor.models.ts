// ── Core Investor Interfaces ──────────────────────────────────────────────────

export interface Investor {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string | null;
  companyId: number;
  companyName: string | null;
  investorType: InvestorType;
  
  // Contact Information
  primaryEmail: string | null;
  primaryPhone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  
  // Professional Details
  position: string | null;
  linkedInUrl: string | null;
  website: string | null;
  yearsOfExperience: number | null;
  bio: string | null;
  
  // Investment Profile
  investmentRange: string | null;
  investmentFocus: string[];
  portfolioCompanies: string | null;
  totalInvestments: number | null;
  
  // Pipeline Tracking
  pipelineStage: PipelineStage;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  priority: number;
  potentialInvestmentAmount: number | null;
  
  // CRM Data
  tags: string[];
  notes: string | null;
  
  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorListItem {
  id: number;
  userFullName: string;
  userEmail: string | null;
  primaryPhone: string | null;
  position: string | null;
  investorType: InvestorType;
  pipelineStage: PipelineStage;
  potentialInvestmentAmount: number | null;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  priority: number;
  isActive: boolean;
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

export interface CreateInvestorRequest {
  userId: number;
  investorType: InvestorType;
  companyId?: number;
  
  // Contact Information
  primaryEmail?: string;
  primaryPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  
  // Professional Details
  position?: string;
  linkedInUrl?: string;
  website?: string;
  yearsOfExperience?: number;
  bio?: string;
  
  // Investment Profile
  investmentRange?: string;
  investmentFocus?: string[];
  portfolioCompanies?: string;
  totalInvestments?: number;
  
  // Pipeline Tracking
  pipelineStage?: PipelineStage;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  priority?: number;
  potentialInvestmentAmount?: number;
  
  // CRM Data
  tags?: string[];
  notes?: string;
  isActive?: boolean;
}

export interface UpdateInvestorRequest {
  investorType?: InvestorType;
  
  // Contact Information
  primaryEmail?: string;
  primaryPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  
  // Professional Details
  position?: string;
  linkedInUrl?: string;
  website?: string;
  yearsOfExperience?: number;
  bio?: string;
  
  // Investment Profile
  investmentRange?: string;
  investmentFocus?: string[];
  portfolioCompanies?: string;
  totalInvestments?: number;
  
  // Pipeline Tracking
  pipelineStage?: PipelineStage;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  priority?: number;
  potentialInvestmentAmount?: number;
  
  // CRM Data
  tags?: string[];
  notes?: string;
  isActive?: boolean;
}

export interface InvestorSearchRequest {
  companyId?: number;
  pipelineStage?: PipelineStage;
  investorType?: InvestorType;
  priority?: number;
  isActive?: boolean;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum InvestorType {
  Angel = 1,
  VentureCapital = 2,
  FamilyOffice = 3,
  Corporate = 4,
  Individual = 5,
}

export enum PipelineStage {
  Target = 1,
  Contacted = 2,
  Pitched = 3,
  DueDiligence = 4,
  TermSheet = 5,
  Committed = 6,
  Invested = 7,
  Passed = 8,
  Inactive = 9,
}

// ── Helper Functions ──────────────────────────────────────────────────────────

export function getInvestorTypeLabel(type: InvestorType): string {
  switch (type) {
    case InvestorType.Angel:
      return 'Angel Investor';
    case InvestorType.VentureCapital:
      return 'Venture Capital';
    case InvestorType.FamilyOffice:
      return 'Family Office';
    case InvestorType.Corporate:
      return 'Corporate Investor';
    case InvestorType.Individual:
      return 'Individual Investor';
    default:
      return 'Unknown';
  }
}

export function getPipelineStageLabel(stage: PipelineStage): string {
  switch (stage) {
    case PipelineStage.Target:
      return 'Target';
    case PipelineStage.Contacted:
      return 'Contacted';
    case PipelineStage.Pitched:
      return 'Pitched';
    case PipelineStage.DueDiligence:
      return 'Due Diligence';
    case PipelineStage.TermSheet:
      return 'Term Sheet';
    case PipelineStage.Committed:
      return 'Committed';
    case PipelineStage.Invested:
      return 'Invested';
    case PipelineStage.Passed:
      return 'Passed';
    case PipelineStage.Inactive:
      return 'Inactive';
    default:
      return 'Unknown';
  }
}

export function getPipelineStageBadgeColor(stage: PipelineStage): string {
  switch (stage) {
    case PipelineStage.Target:
      return 'bg-gray-100 text-gray-800';
    case PipelineStage.Contacted:
      return 'bg-blue-100 text-blue-800';
    case PipelineStage.Pitched:
      return 'bg-indigo-100 text-indigo-800';
    case PipelineStage.DueDiligence:
      return 'bg-purple-100 text-purple-800';
    case PipelineStage.TermSheet:
      return 'bg-yellow-100 text-yellow-800';
    case PipelineStage.Committed:
      return 'bg-orange-100 text-orange-800';
    case PipelineStage.Invested:
      return 'bg-green-100 text-green-800';
    case PipelineStage.Passed:
      return 'bg-red-100 text-red-800';
    case PipelineStage.Inactive:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 5:
      return 'Critical';
    case 4:
      return 'High';
    case 3:
      return 'Medium';
    case 2:
      return 'Low';
    case 1:
      return 'Very Low';
    default:
      return 'Unknown';
  }
}

export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 5:
      return 'bg-red-100 text-red-800';
    case 4:
      return 'bg-orange-100 text-orange-800';
    case 3:
      return 'bg-yellow-100 text-yellow-800';
    case 2:
      return 'bg-blue-100 text-blue-800';
    case 1:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
