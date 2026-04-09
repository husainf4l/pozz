/**
 * Activities Service
 * API service layer for activity feed operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { Activity, PaginatedResponse } from "@/lib/types/api"

export const activitiesService = {
  /**
   * Get all activities
   */
  async getAll(params?: { 
    page?: number
    pageSize?: number
    entityType?: string
    action?: string
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<Activity>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.entityType) queryParams.append('entityType', params.entityType)
    if (params?.action) queryParams.append('action', params.action)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.activities.list}?${queryParams.toString()}`
    return client.get<PaginatedResponse<Activity>>(endpoint)
  },

  /**
   * Get activities for specific entity
   */
  async getByEntity(type: string, id: string): Promise<Activity[]> {
    return client.get(
      API_ENDPOINTS.activities.byEntity
        .replace(':type', type)
        .replace(':id', id)
    )
  },
}
