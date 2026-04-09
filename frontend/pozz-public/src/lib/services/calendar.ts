/**
 * Calendar Service
 * API service layer for calendar operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { CalendarEvent, CreateCalendarEventDto } from "@/lib/types/api"

export const calendarService = {
  /**
   * Get all calendar events
   */
  async getEvents(params?: { 
    start?: string
    end?: string
    type?: string
  }): Promise<CalendarEvent[]> {
    const queryParams = new URLSearchParams()
    
    if (params?.start) queryParams.append('start', params.start)
    if (params?.end) queryParams.append('end', params.end)
    if (params?.type) queryParams.append('type', params.type)

    const endpoint = `${API_ENDPOINTS.calendar.events}?${queryParams.toString()}`
    return client.get<CalendarEvent[]>(endpoint)
  },

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<CalendarEvent> {
    return client.get(API_ENDPOINTS.calendar.byId.replace(':id', id))
  },

  /**
   * Create event
   */
  async create(data: CreateCalendarEventDto): Promise<CalendarEvent> {
    return client.post(API_ENDPOINTS.calendar.events, data)
  },

  /**
   * Update event
   */
  async update(id: string, data: Partial<CreateCalendarEventDto>): Promise<CalendarEvent> {
    return client.put(API_ENDPOINTS.calendar.byId.replace(':id', id), data)
  },

  /**
   * Delete event
   */
  async delete(id: string): Promise<void> {
    return client.delete(API_ENDPOINTS.calendar.byId.replace(':id', id))
  },

  /**
   * Sync with external calendar
   */
  async sync(provider: 'google' | 'outlook' | 'apple'): Promise<void> {
    return client.post(API_ENDPOINTS.calendar.sync.replace(':provider', provider))
  },
}
