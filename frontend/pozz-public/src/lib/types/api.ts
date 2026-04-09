/**
 * API Types and Interfaces
 * Type definitions for API requests and responses
 */

// Common types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// User types
export interface User {
  id: string
  email: string
  name: string
  company?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// Investor types
export interface Investor {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  role: string
  location: string
  status: 'Lead' | 'Contacted' | 'Meeting' | 'Negotiation' | 'Closed'
  source: string
  investmentRange: string
  sectors: string[]
  notes: number
  lastContact: string
  createdAt: string
  updatedAt: string
}

export interface CreateInvestorDto {
  name: string
  email: string
  phone?: string
  company: string
  role: string
  location: string
  status: string
  source: string
  investmentRange: string
  sectors: string[]
}

// Project types
export interface Project {
  id: string
  name: string
  description: string
  stage: string
  targetAmount: string
  raisedAmount: string
  progress: number
  status: 'Active' | 'Closed' | 'On Hold'
  investors: number
  materials: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  name: string
  description: string
  stage: string
  targetAmount: string
  status: string
}

// Pipeline types
export interface PipelineDeal {
  id: string
  investorId: string
  investor: string
  company: string
  amount: string
  stage: 'lead' | 'contacted' | 'meeting' | 'negotiation' | 'closed'
  source: string
  addedDate: string
  avatar: string
}

export interface MoveDealDto {
  dealId: string
  fromStage: string
  toStage: string
}

// Meeting types
export interface Meeting {
  id: string
  title: string
  investorId: string
  investor: string
  company: string
  date: string
  time: string
  duration: string
  type: 'Video Call' | 'In Person' | 'Phone Call'
  status: 'Scheduled' | 'Completed' | 'Cancelled'
  location: string
  outcome?: 'Positive' | 'Neutral' | 'Negative'
  notes?: string
  avatar: string
  createdAt: string
  updatedAt: string
}

export interface CreateMeetingDto {
  title: string
  investorId: string
  date: string
  time: string
  duration: string
  type: string
  location: string
  notes?: string
}

// Note types
export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  linkedTo?: string
  linkedType?: string
  isPinned: boolean
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteDto {
  title: string
  content: string
  tags: string[]
  linkedTo?: string
  linkedType?: string
}

// Distribution types
export interface DistributionPlatform {
  id: string
  name: string
  url: string
  status: 'Active' | 'Inactive'
  views: number
  clicks: number
  investors: number
  deals: number
  conversion: string
  performance: 'high' | 'medium' | 'low'
  lastUpdated: string
}

export interface CreatePlatformDto {
  name: string
  url: string
  status: string
}

// Analytics types
export interface AnalyticsOverview {
  totalPipeline: number
  totalInvestors: number
  activeDeals: number
  weeklyMeetings: number
  investorGrowth: Array<{ label: string; value: number }>
  dealStages: Array<{ label: string; value: number; color: string }>
  sourceDistribution: Array<{ label: string; value: number; color: string }>
}

export interface FinancialAnalytics {
  totalRaised: number
  targetAmount: number
  avgDealSize: number
  burnRate: number
  runway: number
  monthlyFundraising: Array<{ label: string; value: number }>
  dealSizeDistribution: Array<{ label: string; value: number; color: string }>
}

export interface InvestorInsights {
  totalInvestors: number
  avgInvestment: number
  engagementRate: number
  hotLeads: number
  byStage: Array<{ label: string; value: number; color: string }>
  bySector: Array<{ label: string; value: number; color: string }>
  byLocation: Array<{ label: string; value: number }>
}

// Report types
export interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: string[]
}

export interface GenerateReportDto {
  templateId: string
  timeRange: string
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
}

export interface Report {
  id: string
  name: string
  type: string
  size: string
  generatedAt: string
  status: 'Ready' | 'Processing' | 'Failed'
  downloadUrl: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'investor' | 'meeting' | 'deal' | 'task' | 'document' | 'system'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
  icon?: string
}

export interface CreateNotificationDto {
  type: Notification['type']
  title: string
  message: string
  actionUrl?: string
}

// Activity Types
export interface Activity {
  id: string
  userId: string
  entityType: 'investor' | 'project' | 'meeting' | 'note' | 'deal' | 'document' | 'task'
  entityId: string
  action: 'created' | 'updated' | 'deleted' | 'moved' | 'shared' | 'completed'
  description: string
  metadata?: Record<string, any>
  createdAt: string
  actor: {
    id: string
    name: string
    avatar?: string
  }
}

// Document Types
export interface Document {
  id: string
  name: string
  type: 'pitch_deck' | 'financial' | 'legal' | 'term_sheet' | 'other'
  size: number
  url: string
  folderId?: string
  projectId?: string
  investorId?: string
  uploadedBy: string
  uploadedAt: string
  version: number
  tags: string[]
  isShared: boolean
  sharedWith?: string[]
  expiresAt?: string
}

export interface Folder {
  id: string
  name: string
  parentId?: string
  createdAt: string
}

export interface CreateDocumentDto {
  name: string
  type: Document['type']
  folderId?: string
  projectId?: string
  tags?: string[]
}

// Task Types
export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  assignedTo?: string
  relatedTo?: {
    type: 'investor' | 'project' | 'meeting' | 'deal'
    id: string
    name: string
  }
  tags: string[]
  createdAt: string
  completedAt?: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  priority: Task['priority']
  dueDate?: string
  assignedTo?: string
  relatedTo?: Task['relatedTo']
  tags?: string[]
}

// Calendar Event Types
export interface CalendarEvent {
  id: string
  title: string
  type: 'meeting' | 'deadline' | 'reminder' | 'call'
  start: string
  end: string
  allDay: boolean
  location?: string
  attendees: string[]
  meetingId?: string
  color?: string
  reminders: number[] // minutes before
}

export interface CreateCalendarEventDto {
  title: string
  type: CalendarEvent['type']
  start: string
  end: string
  allDay?: boolean
  location?: string
  attendees?: string[]
  meetingId?: string
  reminders?: number[]
}

// Email Types
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: 'outreach' | 'follow_up' | 'update' | 'thank_you'
  variables: string[]
  createdAt: string
}

export interface Email {
  id: string
  to: string
  from: string
  subject: string
  body: string
  templateId?: string
  investorId?: string
  sentAt: string
  openedAt?: string
  clickedAt?: string
  repliedAt?: string
  status: 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced'
}

export interface SendEmailDto {
  to: string[]
  subject: string
  body: string
  templateId?: string
  investorId?: string
}

// Cap Table Types
export interface Shareholder {
  id: string
  name: string
  email: string
  type: 'founder' | 'investor' | 'employee' | 'advisor'
  shares: number
  percentage: number
  investedAmount?: number
  investorId?: string
}

export interface EquityRound {
  id: string
  name: string
  type: 'seed' | 'series_a' | 'series_b' | 'series_c'
  amount: number
  valuation: number
  sharePrice: number
  date: string
  investors: string[]
}

export interface CapTable {
  id: string
  projectId: string
  totalShares: number
  fullyDilutedShares: number
  preMoney: number
  postMoney: number
  shareholders: Shareholder[]
  rounds: EquityRound[]
  updatedAt: string
}

export interface CreateShareholderDto {
  name: string
  email: string
  type: Shareholder['type']
  shares: number
  investedAmount?: number
}

// Settings Types
export interface UserSettings {
  id: string
  userId: string
  notifications: {
    email: boolean
    push: boolean
    newInvestor: boolean
    meetingReminder: boolean
    dealUpdate: boolean
    taskDue: boolean
  }
  preferences: {
    timezone: string
    dateFormat: string
    currency: string
    theme: 'light' | 'dark' | 'auto'
  }
  integrations: {
    googleCalendar?: {
      enabled: boolean
      refreshToken?: string
    }
    outlook?: {
      enabled: boolean
      refreshToken?: string
    }
    slack?: {
      enabled: boolean
      webhookUrl?: string
    }
  }
}

export interface UpdateSettingsDto {
  notifications?: Partial<UserSettings['notifications']>
  preferences?: Partial<UserSettings['preferences']>
  integrations?: Partial<UserSettings['integrations']>
}

// Team Types
export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  avatar?: string
  invitedAt: string
  joinedAt?: string
  status: 'pending' | 'active' | 'inactive'
}

export interface InviteTeamMemberDto {
  email: string
  role: TeamMember['role']
  message?: string
}

// Workflow Types
export interface Workflow {
  id: string
  name: string
  description: string
  trigger: {
    type: 'deal_stage_change' | 'investor_added' | 'meeting_scheduled' | 'task_completed'
    conditions: Record<string, any>
  }
  actions: {
    type: 'send_email' | 'create_task' | 'send_notification' | 'update_field'
    config: Record<string, any>
  }[]
  isActive: boolean
  createdAt: string
}

export interface CreateWorkflowDto {
  name: string
  description: string
  trigger: Workflow['trigger']
  actions: Workflow['actions']
}

// Proposal Types
export interface Proposal {
  id: string
  investorId: string
  projectId: string
  title: string
  amount: number
  equity: number
  valuation: number
  terms: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
  sentAt?: string
  viewedAt?: string
  respondedAt?: string
  createdAt: string
}

export interface CreateProposalDto {
  investorId: string
  projectId: string
  title: string
  amount: number
  equity: number
  valuation: number
  terms: string
}
