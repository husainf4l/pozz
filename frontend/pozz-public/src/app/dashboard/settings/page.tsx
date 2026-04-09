"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { ErrorMessage } from "@/components/error-states"
import { settingsService } from "@/lib/services/settings"
import { teamService } from "@/lib/services/team"
import { useAuth } from "@/contexts/auth-context"
import { 
  User, 
  Bell, 
  Key, 
  Users, 
  CreditCard, 
  Settings as SettingsIcon,
  Save,
  Mail,
  Lock,
  Globe,
  Calendar,
  DollarSign,
  Shield,
  MessageSquare,
  CheckCircle,
  XCircle
} from "lucide-react"
import type { UserSettings, TeamMember } from "@/lib/types/api"

type Tab = 'profile' | 'account' | 'notifications' | 'integrations' | 'team' | 'billing'

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: '',
    bio: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('member')

  const tabs = [
    { id: 'profile' as Tab, name: 'Profile', icon: User },
    { id: 'account' as Tab, name: 'Account', icon: Lock },
    { id: 'notifications' as Tab, name: 'Notifications', icon: Bell },
    { id: 'integrations' as Tab, name: 'Integrations', icon: Key },
    { id: 'team' as Tab, name: 'Team', icon: Users },
    { id: 'billing' as Tab, name: 'Billing', icon: CreditCard },
  ]

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await settingsService.get()
      setSettings(data)
    } catch (err: any) {
      console.error("Failed to load settings:", err)
      setError(err.message || "Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTeamMembers = async () => {
    try {
      const members = await teamService.getMembers()
      setTeamMembers(members)
    } catch (err: any) {
      console.error("Failed to load team members:", err)
    }
  }

  useEffect(() => {
    loadSettings()
    loadTeamMembers()
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSuccessMessage(null)
    try {
      // In real app, this would update user profile via API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage("Profile updated successfully!")
      await refreshUser()
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setIsSaving(true)
    setSuccessMessage(null)
    try {
      // API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage("Password changed successfully!")
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setError(err.message || "Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateNotifications = async (key: keyof UserSettings['notifications'], value: boolean) => {
    if (!settings) return
    try {
      const updated = await settingsService.updateNotifications({
        ...settings.notifications,
        [key]: value
      })
      setSettings(updated)
      setSuccessMessage("Notification preferences updated!")
    } catch (err: any) {
      setError(err.message || "Failed to update notifications")
    }
  }

  const handleToggleIntegration = async (provider: 'googleCalendar' | 'outlook' | 'slack', enabled: boolean) => {
    if (!settings) return
    try {
      const updated = await settingsService.updateIntegrations({
        ...settings.integrations,
        [provider]: { enabled }
      })
      setSettings(updated)
      setSuccessMessage(`${provider} integration ${enabled ? 'enabled' : 'disabled'}!`)
    } catch (err: any) {
      setError(err.message || "Failed to update integration")
    }
  }

  const handleInviteTeamMember = async () => {
    if (!inviteEmail) return
    try {
      await teamService.invite({ email: inviteEmail, role: inviteRole })
      setInviteEmail('')
      setInviteRole('member')
      await loadTeamMembers()
      setSuccessMessage("Team member invited successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to invite team member")
    }
  }

  const handleRemoveTeamMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return
    try {
      await teamService.remove(id)
      await loadTeamMembers()
      setSuccessMessage("Team member removed successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to remove team member")
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingCard />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            <p className="text-green-700 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex gap-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-red-600 text-red-600 dark:text-red-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Change Password
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={isSaving}>
                    <Lock className="w-4 h-4 mr-2" />
                    {isSaving ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>UTC-08:00 (Pacific Time)</option>
                      <option>UTC-05:00 (Eastern Time)</option>
                      <option>UTC+00:00 (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>Auto (System)</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && settings && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'email' as const, label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'push' as const, label: 'Push Notifications', desc: 'Receive browser push notifications' },
                  { key: 'newInvestor' as const, label: 'New Investor Added', desc: 'Notify when a new investor is added' },
                  { key: 'meetingReminder' as const, label: 'Meeting Reminders', desc: 'Remind me 15 minutes before meetings' },
                  { key: 'dealUpdate' as const, label: 'Deal Stage Changes', desc: 'Notify when deals move stages' },
                  { key: 'taskDue' as const, label: 'Task Due Dates', desc: 'Remind me when tasks are due' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleUpdateNotifications(item.key, !settings.notifications[item.key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications[item.key] ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && settings && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connected Integrations
              </h2>
              <div className="grid gap-6">
                {/* Google Calendar */}
                <div className="flex items-start justify-between p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Google Calendar</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Sync your meetings with Google Calendar automatically
                      </p>
                      {settings.integrations.googleCalendar?.enabled && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-500 mt-2">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleToggleIntegration('googleCalendar', !settings.integrations.googleCalendar?.enabled)}
                    variant={settings.integrations.googleCalendar?.enabled ? 'outline' : 'default'}
                  >
                    {settings.integrations.googleCalendar?.enabled ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* Outlook */}
                <div className="flex items-start justify-between p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Microsoft Outlook</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Sync with Outlook calendar and email
                      </p>
                      {settings.integrations.outlook?.enabled && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-500 mt-2">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleToggleIntegration('outlook', !settings.integrations.outlook?.enabled)}
                    variant={settings.integrations.outlook?.enabled ? 'outline' : 'default'}
                  >
                    {settings.integrations.outlook?.enabled ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>

                {/* Slack */}
                <div className="flex items-start justify-between p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Slack</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Get notifications in your Slack workspace
                      </p>
                      {settings.integrations.slack?.enabled && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-500 mt-2">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleToggleIntegration('slack', !settings.integrations.slack?.enabled)}
                    variant={settings.integrations.slack?.enabled ? 'outline' : 'default'}
                  >
                    {settings.integrations.slack?.enabled ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Team Members
                </h2>
              </div>

              {/* Invite Form */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Invite Team Member</h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button onClick={handleInviteTeamMember} disabled={!inviteEmail}>
                    Invite
                  </Button>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {member.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {member.role}
                      </span>
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveTeamMember(member.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Billing & Subscription
              </h2>
              
              {/* Current Plan */}
              <div className="p-6 border-2 border-red-600 rounded-lg bg-red-50 dark:bg-red-900/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Unlimited investors, meetings, and advanced analytics
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                      $99 <span className="text-base font-normal text-gray-600 dark:text-gray-400">/month</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Next billing date: May 9, 2026
                    </p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/2027</p>
                    </div>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Billing History</h3>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {[
                        { date: 'Apr 9, 2026', desc: 'Pro Plan - Monthly', amount: '$99.00', status: 'Paid' },
                        { date: 'Mar 9, 2026', desc: 'Pro Plan - Monthly', amount: '$99.00', status: 'Paid' },
                        { date: 'Feb 9, 2026', desc: 'Pro Plan - Monthly', amount: '$99.00', status: 'Paid' },
                      ].map((invoice, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{invoice.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{invoice.desc}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{invoice.amount}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
