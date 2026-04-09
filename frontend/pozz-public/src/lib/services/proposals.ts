/**
 * Proposals Service
 * API service layer for proposal operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { Proposal, CreateProposalDto, PaginatedResponse } from "@/lib/types/api"

export const proposalsService = {
  /**
   * Get all proposals
   */
  async getAll(params?: { 
    page?: number
    pageSize?: number
    status?: string
  }): Promise<PaginatedResponse<Proposal>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.status) queryParams.append('status', params.status)

    const endpoint = `${API_ENDPOINTS.proposals.list}?${queryParams.toString()}`
    return client.get<PaginatedResponse<Proposal>>(endpoint)
  },

  /**
   * Get proposal by ID
   */
  async getById(id: string): Promise<Proposal> {
    return client.get(API_ENDPOINTS.proposals.byId.replace(':id', id))
  },

  /**
   * Create proposal
   */
  async create(data: CreateProposalDto): Promise<Proposal> {
    return client.post(API_ENDPOINTS.proposals.base, data)
  },

  /**
   * Update proposal
   */
  async update(id: string, data: Partial<CreateProposalDto>): Promise<Proposal> {
    return client.put(API_ENDPOINTS.proposals.byId.replace(':id', id), data)
  },

  /**
   * Send proposal to investor
   */
  async send(id: string): Promise<Proposal> {
    return client.post(API_ENDPOINTS.proposals.send.replace(':id', id))
  },

  /**
   * Delete proposal
   */
  async delete(id: string): Promise<void> {
    return client.delete(API_ENDPOINTS.proposals.byId.replace(':id', id))
  },
}
