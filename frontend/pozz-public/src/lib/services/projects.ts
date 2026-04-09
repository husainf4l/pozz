/**
 * Projects Service
 * API service layer for project operations
 */

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type {
  Project,
  CreateProjectDto,
  PaginatedResponse,
  ApiResponse,
} from '@/lib/types/api'

export const projectsService = {
  /**
   * Get all projects
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
    status?: string
  }): Promise<PaginatedResponse<Project>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.status) queryParams.append('status', params.status)

    const endpoint = `${API_ENDPOINTS.projects.list}?${queryParams.toString()}`
    return apiClient.get<PaginatedResponse<Project>>(endpoint)
  },

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<ApiResponse<Project>>(
      API_ENDPOINTS.projects.get(id)
    )
    return response.data
  },

  /**
   * Create a new project
   */
  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>(
      API_ENDPOINTS.projects.create,
      data
    )
    return response.data
  },

  /**
   * Update a project
   */
  async update(id: string, data: Partial<CreateProjectDto>): Promise<Project> {
    const response = await apiClient.put<ApiResponse<Project>>(
      API_ENDPOINTS.projects.update(id),
      data
    )
    return response.data
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.projects.delete(id))
  },

  /**
   * Upload project material
   */
  async uploadMaterial(projectId: string, file: File, metadata?: Record<string, any>): Promise<any> {
    return apiClient.upload(
      API_ENDPOINTS.projects.materials(projectId),
      file,
      metadata
    )
  },
}

/**
 * Pipeline Service
 * API service layer for pipeline operations
 */

import type { PipelineDeal, MoveDealDto } from '@/lib/types/api'

export const pipelineService = {
  /**
   * Get all pipeline deals
   */
  async getAll(params?: { stage?: string }): Promise<Record<string, PipelineDeal[]>> {
    const queryParams = new URLSearchParams()
    if (params?.stage) queryParams.append('stage', params.stage)

    const endpoint = `${API_ENDPOINTS.pipeline.list}?${queryParams.toString()}`
    const response = await apiClient.get<ApiResponse<Record<string, PipelineDeal[]>>>(endpoint)
    return response.data
  },

  /**
   * Get a single deal by ID
   */
  async getById(id: string): Promise<PipelineDeal> {
    const response = await apiClient.get<ApiResponse<PipelineDeal>>(
      API_ENDPOINTS.pipeline.get(id)
    )
    return response.data
  },

  /**
   * Create a new deal
   */
  async create(data: Partial<PipelineDeal>): Promise<PipelineDeal> {
    const response = await apiClient.post<ApiResponse<PipelineDeal>>(
      API_ENDPOINTS.pipeline.create,
      data
    )
    return response.data
  },

  /**
   * Move a deal to a different stage
   */
  async moveDeal(dealId: string, toStage: string): Promise<PipelineDeal> {
    const response = await apiClient.patch<ApiResponse<PipelineDeal>>(
      API_ENDPOINTS.pipeline.move(dealId),
      { toStage }
    )
    return response.data
  },

  /**
   * Update a deal
   */
  async update(id: string, data: Partial<PipelineDeal>): Promise<PipelineDeal> {
    const response = await apiClient.put<ApiResponse<PipelineDeal>>(
      API_ENDPOINTS.pipeline.update(id),
      data
    )
    return response.data
  },

  /**
   * Delete a deal
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.pipeline.delete(id))
  },
}
