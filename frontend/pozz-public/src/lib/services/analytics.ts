/**
 * Analytics Service
 * API service layer for analytics and reporting
 */

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type { ApiResponse } from '@/lib/types/api'

export interface AnalyticsDashboard {
  overview: {
    totalInvestors: number
    totalProjects: number
    totalFunding: number
    conversionRate: number
  }
  trends: {
    investors: Array<{ month: string; count: number }>
    funding: Array<{ month: string; amount: number }>
  }
  byStage: Record<string, number>
  bySector: Record<string, number>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export interface FinancialAnalytics {
  overview: {
    totalRaised: number
    totalCommitted: number
    burnRate: number
    runway: number
  }
  cashflow: Array<{
    month: string
    income: number
    expenses: number
    net: number
  }>
  milestones: Array<{
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    deadline: string
  }>
}

export interface InvestorAnalytics {
  byStage: Record<string, number>
  bySector: Record<string, number>
  byLocation: Record<string, number>
  engagement: {
    totalContacts: number
    meetingsScheduled: number
    avgResponseTime: number
  }
  conversionFunnel: Array<{
    stage: string
    count: number
    percentage: number
  }>
}

export const analyticsService = {
  /**
   * Get dashboard overview analytics
   */
  async getDashboard(params?: {
    startDate?: string
    endDate?: string
  }): Promise<AnalyticsDashboard> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.analytics.dashboard}?${queryParams.toString()}`
    const response = await apiClient.get<ApiResponse<AnalyticsDashboard>>(endpoint)
    return response.data
  },

  /**
   * Get financial analytics
   */
  async getFinancial(params?: {
    startDate?: string
    endDate?: string
  }): Promise<FinancialAnalytics> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.analytics.financial}?${queryParams.toString()}`
    const response = await apiClient.get<ApiResponse<FinancialAnalytics>>(endpoint)
    return response.data
  },

  /**
   * Get investor analytics
   */
  async getInvestors(params?: {
    startDate?: string
    endDate?: string
  }): Promise<InvestorAnalytics> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.analytics.investors}?${queryParams.toString()}`
    const response = await apiClient.get<ApiResponse<InvestorAnalytics>>(endpoint)
    return response.data
  },

  /**
   * Export analytics data
   */
  async exportData(format: 'csv' | 'excel' | 'pdf', params?: {
    startDate?: string
    endDate?: string
  }): Promise<Blob> {
    const queryParams = new URLSearchParams()
    queryParams.append('format', format)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.analytics.export}?${queryParams.toString()}`
    return apiClient.get<Blob>(endpoint)
  },
}

/**
 * Reports Service
 * API service layer for report generation and management
 */

import type { Report, ReportTemplate } from '@/lib/types/api'

export const reportsService = {
  /**
   * Get all report templates
   */
  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await apiClient.get<ApiResponse<ReportTemplate[]>>(
      API_ENDPOINTS.reports.templates
    )
    return response.data
  },

  /**
   * Get all generated reports
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
  }): Promise<Report[]> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const endpoint = `${API_ENDPOINTS.reports.list}?${queryParams.toString()}`
    const response = await apiClient.get<ApiResponse<Report[]>>(endpoint)
    return response.data
  },

  /**
   * Generate a new report
   */
  async generate(data: {
    templateId?: string
    title: string
    type: string
    parameters: Record<string, any>
  }): Promise<Report> {
    const response = await apiClient.post<ApiResponse<Report>>(
      API_ENDPOINTS.reports.generate,
      data
    )
    return response.data
  },

  /**
   * Get a specific report
   */
  async getById(id: string): Promise<Report> {
    const response = await apiClient.get<ApiResponse<Report>>(
      API_ENDPOINTS.reports.get(id)
    )
    return response.data
  },

  /**
   * Download a report
   */
  async download(id: string, format: 'pdf' | 'excel'): Promise<Blob> {
    const endpoint = `${API_ENDPOINTS.reports.download(id)}?format=${format}`
    return apiClient.get<Blob>(endpoint)
  },

  /**
   * Delete a report
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.reports.delete(id))
  },

  /**
   * Schedule a report
   */
  async schedule(data: {
    templateId: string
    frequency: string
    recipients: string[]
    parameters: Record<string, any>
  }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.reports.schedule,
      data
    )
    return response.data
  },
}
