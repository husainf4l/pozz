/**
 * Investors Service
 * API service layer for investor operations
 */

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type {
  Investor,
  CreateInvestorDto,
  PaginatedResponse,
  ApiResponse,
} from '@/lib/types/api'

export const investorsService = {
  /**
   * Get all investors with optional filters
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
    status?: string
    source?: string
    search?: string
  }): Promise<PaginatedResponse<Investor>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.source) queryParams.append('source', params.source)
    if (params?.search) queryParams.append('search', params.search)

    const endpoint = `${API_ENDPOINTS.investors.list}?${queryParams.toString()}`
    return apiClient.get<PaginatedResponse<Investor>>(endpoint)
  },

  /**
   * Get a single investor by ID
   */
  async getById(id: string): Promise<Investor> {
    const response = await apiClient.get<ApiResponse<Investor>>(
      API_ENDPOINTS.investors.get(id)
    )
    return response.data
  },

  /**
   * Create a new investor
   */
  async create(data: CreateInvestorDto): Promise<Investor> {
    const response = await apiClient.post<ApiResponse<Investor>>(
      API_ENDPOINTS.investors.create,
      data
    )
    return response.data
  },

  /**
   * Update an investor
   */
  async update(id: string, data: Partial<CreateInvestorDto>): Promise<Investor> {
    const response = await apiClient.put<ApiResponse<Investor>>(
      API_ENDPOINTS.investors.update(id),
      data
    )
    return response.data
  },

  /**
   * Delete an investor
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.investors.delete(id))
  },

  /**
   * Search investors
   */
  async search(query: string): Promise<Investor[]> {
    const response = await apiClient.get<ApiResponse<Investor[]>>(
      `${API_ENDPOINTS.investors.search}?q=${encodeURIComponent(query)}`
    )
    return response.data
  },
}
