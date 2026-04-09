/**
 * Tasks Service
 * API service layer for task management operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { Task, CreateTaskDto, PaginatedResponse } from "@/lib/types/api"

export const tasksService = {
  /**
   * Get all tasks
   */
  async getAll(params?: { 
    page?: number
    pageSize?: number
    status?: string
    priority?: string
    assignedTo?: string
  }): Promise<PaginatedResponse<Task>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.priority) queryParams.append('priority', params.priority)
    if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo)

    const endpoint = `${API_ENDPOINTS.tasks.list}?${queryParams.toString()}`
    return client.get<PaginatedResponse<Task>>(endpoint)
  },

  /**
   * Get upcoming tasks
   */
  async getUpcoming(): Promise<Task[]> {
    return client.get(API_ENDPOINTS.tasks.upcoming)
  },

  /**
   * Get task by ID
   */
  async getById(id: string): Promise<Task> {
    return client.get(API_ENDPOINTS.tasks.byId.replace(':id', id))
  },

  /**
   * Create task
   */
  async create(data: CreateTaskDto): Promise<Task> {
    return client.post(API_ENDPOINTS.tasks.base, data)
  },

  /**
   * Update task
   */
  async update(id: string, data: Partial<CreateTaskDto>): Promise<Task> {
    return client.put(API_ENDPOINTS.tasks.byId.replace(':id', id), data)
  },

  /**
   * Complete task
   */
  async complete(id: string): Promise<Task> {
    return client.post(API_ENDPOINTS.tasks.complete.replace(':id', id))
  },

  /**
   * Delete task
   */
  async delete(id: string): Promise<void> {
    return client.delete(API_ENDPOINTS.tasks.byId.replace(':id', id))
  },
}
