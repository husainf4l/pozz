/**
 * Settings Service
 * API service layer for user settings operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { UserSettings, UpdateSettingsDto } from "@/lib/types/api"

export const settingsService = {
  /**
   * Get user settings
   */
  async get(): Promise<UserSettings> {
    return client.get(API_ENDPOINTS.settings.get)
  },

  /**
   * Update settings
   */
  async update(data: UpdateSettingsDto): Promise<UserSettings> {
    return client.put(API_ENDPOINTS.settings.update, data)
  },

  /**
   * Update notification preferences
   */
  async updateNotifications(data: Partial<UserSettings['notifications']>): Promise<UserSettings> {
    return client.put(API_ENDPOINTS.settings.notifications, data)
  },

  /**
   * Update integrations
   */
  async updateIntegrations(data: Partial<UserSettings['integrations']>): Promise<UserSettings> {
    return client.put(API_ENDPOINTS.settings.integrations, data)
  },
}
