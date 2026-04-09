/**
 * Workflows Service
 * API service layer for workflow automation operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { Workflow, CreateWorkflowDto } from "@/lib/types/api"

export const workflowsService = {
  /**
   * Get all workflows
   */
  async getAll(): Promise<Workflow[]> {
    return client.get(API_ENDPOINTS.workflows.list)
  },

  /**
   * Get workflow by ID
   */
  async getById(id: string): Promise<Workflow> {
    return client.get(API_ENDPOINTS.workflows.byId.replace(':id', id))
  },

  /**
   * Create workflow
   */
  async create(data: CreateWorkflowDto): Promise<Workflow> {
    return client.post(API_ENDPOINTS.workflows.base, data)
  },

  /**
   * Update workflow
   */
  async update(id: string, data: Partial<CreateWorkflowDto>): Promise<Workflow> {
    return client.put(API_ENDPOINTS.workflows.byId.replace(':id', id), data)
  },

  /**
   * Toggle workflow active status
   */
  async toggle(id: string): Promise<Workflow> {
    return client.post(API_ENDPOINTS.workflows.toggle.replace(':id', id))
  },

  /**
   * Delete workflow
   */
  async delete(id: string): Promise<void> {
    return client.delete(API_ENDPOINTS.workflows.byId.replace(':id', id))
  },
}
