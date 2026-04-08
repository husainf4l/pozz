// ── Core Investment Interfaces ────────────────────────────────────────────────

export interface Investment {
  id: number;
  investorId: number;
  investorName: string;
  investorEmail: string | null;
  projectId: number | null;
  projectName: string | null;
  companyId: number;
  
  // Investment Details
  committedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  equityPercentage: number;
  instrument: InvestmentInstrument;
  paymentStatus: PaymentStatus;
  
  // SAFE / Convertible Note Specific
  valuationCap: number | null;
  discountRate: number | null;
  interestRate: number | null;
  maturityDate: string | null;
  
  // Dates
  commitmentDate: string;
  closingDate: string | null;
  firstPaymentDate: string | null;
  finalPaymentDate: string | null;
  
  // Legal & Documentation
  termSheetUrl: string | null;
  agreementUrl: string | null;
  shareCertificateUrl: string | null;
  shareCertificateNumber: number | null;
  
  // Additional Terms
  hasBoardSeat: boolean;
  hasVetoRights: boolean;
  hasInformationRights: boolean;
  liquidationPreferenceMultiple: number | null;
  isParticipating: boolean;
  hasAntiDilution: boolean;
  antiDilutionType: string | null;
  
  // CRM / Tracking
  notes: string | null;
  internalReference: string | null;
  status: InvestmentStatus;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  lastModifiedBy: number | null;
}

export interface InvestmentListItem {
  id: number;
  investorName: string;
  projectName: string | null;
  committedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  equityPercentage: number;
  instrument: InvestmentInstrument;
  paymentStatus: PaymentStatus;
  commitmentDate: string;
  closingDate: string | null;
  status: InvestmentStatus;
}

// ── Request DTOs ──────────────────────────────────────────────────────────────

export interface CreateInvestmentRequest {
  investorId: number;
  projectId?: number;
  companyId: number;
  
  // Investment Details
  committedAmount: number;
  paidAmount?: number;
  equityPercentage: number;
  instrument?: InvestmentInstrument;
  paymentStatus?: PaymentStatus;
  
  // SAFE / Convertible Note Specific
  valuationCap?: number;
  discountRate?: number;
  interestRate?: number;
  maturityDate?: string;
  
  // Dates
  commitmentDate: string;
  closingDate?: string;
  firstPaymentDate?: string;
  finalPaymentDate?: string;
  
  // Legal & Documentation
  termSheetUrl?: string;
  agreementUrl?: string;
  shareCertificateUrl?: string;
  shareCertificateNumber?: number;
  
  // Additional Terms
  hasBoardSeat?: boolean;
  hasVetoRights?: boolean;
  hasInformationRights?: boolean;
  liquidationPreferenceMultiple?: number;
  isParticipating?: boolean;
  hasAntiDilution?: boolean;
  antiDilutionType?: string;
  
  // CRM / Tracking
  notes?: string;
  internalReference?: string;
  status?: InvestmentStatus;
}

export interface UpdateInvestmentRequest {
  committedAmount?: number;
  paidAmount?: number;
  equityPercentage?: number;
  instrument?: InvestmentInstrument;
  paymentStatus?: PaymentStatus;
  valuationCap?: number;
  discountRate?: number;
  interestRate?: number;
  maturityDate?: string;
  commitmentDate?: string;
  closingDate?: string;
  firstPaymentDate?: string;
  finalPaymentDate?: string;
  termSheetUrl?: string;
  agreementUrl?: string;
  shareCertificateUrl?: string;
  shareCertificateNumber?: number;
  hasBoardSeat?: boolean;
  hasVetoRights?: boolean;
  hasInformationRights?: boolean;
  liquidationPreferenceMultiple?: number;
  isParticipating?: boolean;
  hasAntiDilution?: boolean;
  antiDilutionType?: string;
  notes?: string;
  internalReference?: string;
  status?: InvestmentStatus;
}

export interface InvestmentSearchRequest {
  companyId?: number;
  investorId?: number;
  projectId?: number;
  paymentStatus?: PaymentStatus;
  status?: InvestmentStatus;
  instrument?: InvestmentInstrument;
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

export enum InvestmentInstrument {
  Equity = 1,
  SAFE = 2,
  ConvertibleNote = 3,
  RevenueShare = 4,
  Debt = 5,
  Warrant = 6,
  PreferredStock = 7,
  CommonStock = 8,
}

export enum PaymentStatus {
  Pending = 1,
  Partial = 2,
  Paid = 3,
  Overdue = 4,
  Cancelled = 5,
}

export enum InvestmentStatus {
  Active = 1,
  Exited = 2,
  WrittenOff = 3,
  Cancelled = 4,
}

// ── Helper Functions ──────────────────────────────────────────────────────────

export function getInstrumentLabel(instrument: InvestmentInstrument): string {
  switch (instrument) {
    case InvestmentInstrument.Equity:
      return 'Equity';
    case InvestmentInstrument.SAFE:
      return 'SAFE';
    case InvestmentInstrument.ConvertibleNote:
      return 'Convertible Note';
    case InvestmentInstrument.RevenueShare:
      return 'Revenue Share';
    case InvestmentInstrument.Debt:
      return 'Debt';
    case InvestmentInstrument.Warrant:
      return 'Warrant';
    case InvestmentInstrument.PreferredStock:
      return 'Preferred Stock';
    case InvestmentInstrument.CommonStock:
      return 'Common Stock';
    default:
      return 'Unknown';
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.Pending:
      return 'Pending';
    case PaymentStatus.Partial:
      return 'Partial';
    case PaymentStatus.Paid:
      return 'Paid';
    case PaymentStatus.Overdue:
      return 'Overdue';
    case PaymentStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

export function getPaymentStatusBadgeColor(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case PaymentStatus.Partial:
      return 'bg-blue-100 text-blue-800';
    case PaymentStatus.Paid:
      return 'bg-green-100 text-green-800';
    case PaymentStatus.Overdue:
      return 'bg-red-100 text-red-800';
    case PaymentStatus.Cancelled:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getInvestmentStatusLabel(status: InvestmentStatus): string {
  switch (status) {
    case InvestmentStatus.Active:
      return 'Active';
    case InvestmentStatus.Exited:
      return 'Exited';
    case InvestmentStatus.WrittenOff:
      return 'Written Off';
    case InvestmentStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

export function getInvestmentStatusBadgeColor(status: InvestmentStatus): string {
  switch (status) {
    case InvestmentStatus.Active:
      return 'bg-green-100 text-green-800';
    case InvestmentStatus.Exited:
      return 'bg-blue-100 text-blue-800';
    case InvestmentStatus.WrittenOff:
      return 'bg-red-100 text-red-800';
    case InvestmentStatus.Cancelled:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
