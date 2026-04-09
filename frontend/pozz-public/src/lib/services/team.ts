/**
 * Team Service
 * API service layer for team management operations
 */

import { apiClient as client } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/config"
import type { TeamMember, InviteTeamMemberDto } from "@/lib/types/api"

export const teamService = {
  /**
   * Get all team members
   */
  async getMembers(): Promise<TeamMember[]> {
    return client.get(API_ENDPOINTS.team.members)
  },

  /**
   * Invite team member
   */
  async invite(data: InviteTeamMemberDto): Promise<TeamMember> {
    return client.post(API_ENDPOINTS.team.invite, data)
  },

  /**
   * Remove team member
   */
  async remove(id: string): Promise<void> {
    return client.delete(API_ENDPOINTS.team.remove.replace(':id', id))
  },

  /**
   * Update member role
   */
  async updateRole(id: string, role: TeamMember['role']): Promise<TeamMember> {
    return client.put(API_ENDPOINTS.team.updateRole.replace(':id', id), { role })
  },
}
