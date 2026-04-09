"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "@/components/loading-states"
import { emailsService } from "@/lib/services/emails"
import { 
  Plus, 
  Send, 
  Mail, 
  Eye, 
  MousePointerClick,
  Reply,
  FileText,
  Search
} from "lucide-react"
import type { Email, EmailTemplate } from "@/lib/types/api"

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [activeTab, setActiveTab] = useState<'sent' | 'templates'>('sent')
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadEmails = async () => {
    try {
      setIsLoading(true)
      const response = await emailsService.getAll({ page: 1, pageSize: 100 })
      setEmails(response.data)
      const templateData = await emailsService.getTemplates()
      setTemplates(templateData)
    } catch (err) {
      console.error("Failed to load emails:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmails()
  }, [])

  const getStatusColor = (status: Email['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      case 'opened':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'clicked':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'replied':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'bounced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    }
  }

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(search.toLowerCase()) ||
    email.to.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    sent: emails.length,
    opened: emails.filter(e => e.openedAt).length,
    clicked: emails.filter(e => e.clickedAt).length,
    replied: emails.filter(e => e.repliedAt).length,
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Emails
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage email campaigns and templates
            </p>
          </div>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sent}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Opened</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              {stats.opened} ({stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(0) : 0}%)
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-purple-600 dark:text-purple-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Clicked</p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">{stats.clicked}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Reply className="w-4 h-4 text-green-600 dark:text-green-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.replied}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'sent'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Sent Emails
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'templates'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Templates ({templates.length})
          </button>
        </div>

        {/* Sent Emails Tab */}
        {activeTab === 'sent' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Emails List */}
            <div className="space-y-3">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {email.subject}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(email.status)}`}>
                          {email.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>To: {email.to}</span>
                        <span>•</span>
                        <span>Sent {new Date(email.sentAt).toLocaleDateString()}</span>
                      </div>
                      {email.openedAt && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Opened {new Date(email.openedAt).toLocaleDateString()}
                          </span>
                          {email.clickedAt && (
                            <span className="flex items-center gap-1">
                              <MousePointerClick className="w-3 h-3" />
                              Clicked
                            </span>
                          )}
                          {email.repliedAt && (
                            <span className="flex items-center gap-1">
                              <Reply className="w-3 h-3" />
                              Replied
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-10 h-10 text-red-600 dark:text-red-500" />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.category === 'outreach'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : template.category === 'follow_up'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {template.category.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {template.subject}
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  <Send className="w-3 h-3 mr-2" />
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
