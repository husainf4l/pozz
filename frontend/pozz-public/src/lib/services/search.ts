/**
 * Search Service
 * API service layer for global search operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { Investor, Project, Meeting, Note } from "@/lib/types/api"

export interface SearchResults {
  investors: Investor[]
  projects: Project[]
  meetings: Meeting[]
  notes: Note[]
  total: number
}

export const searchService = {
  /**
   * Global search across all entities
   */
  async global(query: string, filters?: {
    types?: ('investors' | 'projects' | 'meetings' | 'notes')[]
    limit?: number
  }): Promise<SearchResults> {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    
    if (filters?.types) filters.types.forEach(type => queryParams.append('types', type))
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())

    const endpoint = `${API_ENDPOINTS.search.global}?${queryParams.toString()}`
    return client.get<SearchResults>(endpoint)
  },

  /**
   * Search investors only
   */
  async investors(query: string): Promise<Investor[]> {
    const endpoint = `${API_ENDPOINTS.search.investors}?q=${encodeURIComponent(query)}`
    return client.get<Investor[]>(endpoint)
  },

  /**
   * Search projects only
   */
  async projects(query: string): Promise<Project[]> {
    const endpoint = `${API_ENDPOINTS.search.projects}?q=${encodeURIComponent(query)}`
    return client.get<Project[]>(endpoint)
  },

  /**
   * Search meetings only
   */
  async meetings(query: string): Promise<Meeting[]> {
    const endpoint = `${API_ENDPOINTS.search.meetings}?q=${encodeURIComponent(query)}`
    return client.get<Meeting[]>(endpoint)
  },

  /**
   * Search notes only
   */
  async notes(query: string): Promise<Note[]> {
    const endpoint = `${API_ENDPOINTS.search.notes}?q=${encodeURIComponent(query)}`
    return client.get<Note[]>(endpoint)
  },
}
