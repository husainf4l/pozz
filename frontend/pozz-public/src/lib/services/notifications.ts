/**
 * Notifications Service
 * API service layer for notification operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { 
  Notification, 
  CreateNotificationDto,
  PaginatedResponse 
} from "@/lib/types/api"

export const notificationsService = {
  /**
   * Get all notifications
   */
  async getAll(params?: { page?: number; pageSize?: number; unreadOnly?: boolean }): Promise<PaginatedResponse<Notification>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    if (params?.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly.toString())

    const endpoint = `${API_ENDPOINTS.notifications.list}?${queryParams.toString()}`
    return client.get<PaginatedResponse<Notification>>(endpoint)
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return client.get(API_ENDPOINTS.notifications.unread)
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    return client.post(API_ENDPOINTS.notifications.read.replace(':id', id))
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    return client.post(API_ENDPOINTS.notifications.readAll)
  },

  /**
   * Create notification (admin/system)
   */
  async create(data: CreateNotificationDto): Promise<Notification> {
    return client.post(API_ENDPOINTS.notifications.base, data)
  },
}
