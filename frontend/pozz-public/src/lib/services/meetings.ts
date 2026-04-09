/**
 * Meetings Service
 * API service layer for meeting operations
 */

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type {
  Meeting,
  CreateMeetingDto,
  PaginatedResponse,
  ApiResponse,
} from '@/lib/types/api'

export const meetingsService = {
  /**
   * Get all meetings
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
    status?: string
  }): Promise<PaginatedResponse<Meeting>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.status) queryParams.append('status', params.status)

    const endpoint = `${API_ENDPOINTS.meetings.list}?${queryParams.toString()}`
    return apiClient.get<PaginatedResponse<Meeting>>(endpoint)
  },

  /**
   * Get upcoming meetings
   */
  async getUpcoming(): Promise<Meeting[]> {
    const response = await apiClient.get<ApiResponse<Meeting[]>>(
      API_ENDPOINTS.meetings.upcoming
    )
    return response.data
  },

  /**
   * Get past meetings
   */
  async getPast(): Promise<Meeting[]> {
    const response = await apiClient.get<ApiResponse<Meeting[]>>(
      API_ENDPOINTS.meetings.past
    )
    return response.data
  },

  /**
   * Get a single meeting by ID
   */
  async getById(id: string): Promise<Meeting> {
    const response = await apiClient.get<ApiResponse<Meeting>>(
      API_ENDPOINTS.meetings.get(id)
    )
    return response.data
  },

  /**
   * Create a new meeting
   */
  async create(data: CreateMeetingDto): Promise<Meeting> {
    const response = await apiClient.post<ApiResponse<Meeting>>(
      API_ENDPOINTS.meetings.create,
      data
    )
    return response.data
  },

  /**
   * Update a meeting
   */
  async update(id: string, data: Partial<CreateMeetingDto>): Promise<Meeting> {
    const response = await apiClient.put<ApiResponse<Meeting>>(
      API_ENDPOINTS.meetings.update(id),
      data
    )
    return response.data
  },

  /**
   * Delete a meeting
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.meetings.delete(id))
  },
}

/**
 * Notes Service
 * API service layer for note operations
 */

import type { Note, CreateNoteDto } from '@/lib/types/api'

export const notesService = {
  /**
   * Get all notes
   */
  async getAll(params?: {
    page?: number
    pageSize?: number
    tags?: string[]
    search?: string
  }): Promise<PaginatedResponse<Note>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.tags) params.tags.forEach(tag => queryParams.append('tags', tag))
    if (params?.search) queryParams.append('search', params.search)

    const endpoint = `${API_ENDPOINTS.notes.list}?${queryParams.toString()}`
    return apiClient.get<PaginatedResponse<Note>>(endpoint)
  },

  /**
   * Get a single note by ID
   */
  async getById(id: string): Promise<Note> {
    const response = await apiClient.get<ApiResponse<Note>>(
      API_ENDPOINTS.notes.get(id)
    )
    return response.data
  },

  /**
   * Create a new note
   */
  async create(data: CreateNoteDto): Promise<Note> {
    const response = await apiClient.post<ApiResponse<Note>>(
      API_ENDPOINTS.notes.create,
      data
    )
    return response.data
  },

  /**
   * Update a note
   */
  async update(id: string, data: Partial<CreateNoteDto>): Promise<Note> {
    const response = await apiClient.put<ApiResponse<Note>>(
      API_ENDPOINTS.notes.update(id),
      data
    )
    return response.data
  },

  /**
   * Delete a note
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.notes.delete(id))
  },

  /**
   * Toggle pin status
   */
  async togglePin(id: string): Promise<Note> {
    const response = await apiClient.patch<ApiResponse<Note>>(
      `${API_ENDPOINTS.notes.update(id)}/pin`
    )
    return response.data
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<Note> {
    const response = await apiClient.patch<ApiResponse<Note>>(
      `${API_ENDPOINTS.notes.update(id)}/favorite`
    )
    return response.data
  },

  /**
   * Search notes
   */
  async search(query: string): Promise<Note[]> {
    const response = await apiClient.get<ApiResponse<Note[]>>(
      `${API_ENDPOINTS.notes.search}?q=${encodeURIComponent(query)}`
    )
    return response.data
  },
}
