/**
 * Cap Table Service
 * API service layer for cap table operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { CapTable, CreateShareholderDto, EquityRound, Shareholder } from "@/lib/types/api"

export const capTableService = {
  /**
   * Get cap table for project
   */
  async get(projectId: string): Promise<CapTable> {
    return client.get(API_ENDPOINTS.capTable.get.replace(':projectId', projectId))
  },

  /**
   * Add shareholder
   */
  async addShareholder(projectId: string, data: CreateShareholderDto): Promise<Shareholder> {
    return client.post(
      API_ENDPOINTS.capTable.shareholders.replace(':projectId', projectId),
      data
    )
  },

  /**
   * Update shareholder
   */
  async updateShareholder(
    projectId: string,
    shareholderId: string,
    data: Partial<CreateShareholderDto>
  ): Promise<Shareholder> {
    return client.put(
      `${API_ENDPOINTS.capTable.shareholders.replace(':projectId', projectId)}/${shareholderId}`,
      data
    )
  },

  /**
   * Remove shareholder
   */
  async removeShareholder(projectId: string, shareholderId: string): Promise<void> {
    return client.delete(
      `${API_ENDPOINTS.capTable.shareholders.replace(':projectId', projectId)}/${shareholderId}`
    )
  },

  /**
   * Add funding round
   */
  async addRound(projectId: string, data: Omit<EquityRound, 'id'>): Promise<EquityRound> {
    return client.post(
      API_ENDPOINTS.capTable.rounds.replace(':projectId', projectId),
      data
    )
  },

  /**
   * Simulate dilution
   */
  async simulate(projectId: string, newRound: {
    amount: number
    valuation: number
  }): Promise<{
    newShareholdings: Shareholder[]
    dilution: Record<string, number>
  }> {
    return client.post(
      API_ENDPOINTS.capTable.simulate.replace(':projectId', projectId),
      newRound
    )
  },
}
