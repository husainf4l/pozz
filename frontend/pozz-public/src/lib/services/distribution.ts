/**
 * Distribution Service
 * API service layer for distribution platform operations
 */

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type {
  DistributionPlatform,
  PaginatedResponse,
  ApiResponse,
} from '@/lib/types/api'

export const distributionService = {
  /**
   * Get all distribution platforms
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
    status?: string
  }): Promise<PaginatedResponse<DistributionPlatform>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.status) queryParams.append('status', params.status)

    const endpoint = `${API_ENDPOINTS.distribution.list}?${queryParams.toString()}`
    return apiClient.get<PaginatedResponse<DistributionPlatform>>(endpoint)
  },

  /**
   * Get a single platform by ID
   */
  async getById(id: string): Promise<DistributionPlatform> {
    const response = await apiClient.get<ApiResponse<DistributionPlatform>>(
      API_ENDPOINTS.distribution.get(id)
    )
    return response.data
  },

  /**
   * Create a new distribution platform
   */
  async create(data: Partial<DistributionPlatform>): Promise<DistributionPlatform> {
    const response = await apiClient.post<ApiResponse<DistributionPlatform>>(
      API_ENDPOINTS.distribution.create,
      data
    )
    return response.data
  },

  /**
   * Update a distribution platform
   */
  async update(id: string, data: Partial<DistributionPlatform>): Promise<DistributionPlatform> {
    const response = await apiClient.put<ApiResponse<DistributionPlatform>>(
      API_ENDPOINTS.distribution.update(id),
      data
    )
    return response.data
  },

  /**
   * Delete a distribution platform
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.distribution.delete(id))
  },

  /**
   * Sync platform data
   */
  async sync(id: string): Promise<DistributionPlatform> {
    const response = await apiClient.post<ApiResponse<DistributionPlatform>>(
      `${API_ENDPOINTS.distribution.update(id)}/sync`
    )
    return response.data
  },

  /**
   * Get platform analytics
   */
  async getAnalytics(id: string, params?: { startDate?: string; endDate?: string }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.distribution.analytics(id)}?${queryParams.toString()}`
    const response = await apiClient.get<ApiResponse<any>>(endpoint)
    return response.data
  },
}
