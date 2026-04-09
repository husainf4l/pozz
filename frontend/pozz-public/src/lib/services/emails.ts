/**
 * Emails Service
 * API service layer for email operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { 
  Email, 
  EmailTemplate, 
  SendEmailDto,
  PaginatedResponse 
} from "@/lib/types/api"

export const emailsService = {
  /**
   * Send email
   */
  async send(data: SendEmailDto): Promise<Email> {
    return client.post(API_ENDPOINTS.emails.send, data)
  },

  /**
   * Get email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    return client.get(API_ENDPOINTS.emails.templates)
  },

  /**
   * Get sent emails
   */
  async getAll(params?: { 
    page?: number
    pageSize?: number
    investorId?: string
  }): Promise<PaginatedResponse<Email>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.investorId) queryParams.append('investorId', params.investorId)

    const endpoint = `${API_ENDPOINTS.emails.base}?${queryParams.toString()}`
    return client.get<PaginatedResponse<Email>>(endpoint)
  },

  /**
   * Get email tracking data
   */
  async getTracking(id: string): Promise<Email> {
    return client.get(API_ENDPOINTS.emails.tracking.replace(':id', id))
  },
}
