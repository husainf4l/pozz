"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { LoadingCard } from "@/components/loading-states"
import { activitiesService } from "@/lib/services/activities"
import { 
  Activity as ActivityIcon, 
  Users, 
  FolderKanban, 
  Calendar, 
  FileText, 
  TrendingUp,
  CheckCircle,
  Edit,
  Trash2,
  Share2
} from "lucide-react"
import type { Activity } from "@/lib/types/api"

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filter, setFilter] = useState<'all' | string>('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadActivities = async () => {
    try {
      setIsLoading(true)
      const response = await activitiesService.getAll({
        page: 1,
        pageSize: 100,
        entityType: filter !== 'all' ? filter : undefined,
      })
      setActivities(response.data)
    } catch (err) {
      console.error("Failed to load activities:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [filter])

  const getIcon = (entityType: Activity['entityType']) => {
    switch (entityType) {
      case 'investor':
        return <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
      case 'project':
        return <FolderKanban className="w-5 h-5 text-purple-600 dark:text-purple-500" />
      case 'meeting':
        return <Calendar className="w-5 h-5 text-green-600 dark:text-green-500" />
      case 'note':
        return <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
      case 'deal':
        return <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-500" />
      default:
        return <ActivityIcon className="w-5 h-5 text-gray-600 dark:text-gray-500" />
    }
  }

  const getActionIcon = (action: Activity['action']) => {
    switch (action) {
      case 'created':
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case 'updated':
        return <Edit className="w-3 h-3 text-blue-600" />
      case 'deleted':
        return <Trash2 className="w-3 h-3 text-red-600" />
      case 'shared':
        return <Share2 className="w-3 h-3 text-purple-600" />
      default:
        return null
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activity Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all actions across your account
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'investor', label: 'Investors' },
            { id: 'project', label: 'Projects' },
            { id: 'meeting', label: 'Meetings' },
            { id: 'deal', label: 'Deals' },
            { id: 'note', label: 'Notes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === item.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ActivityIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No activity yet
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Activity will appear here as you work
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {activities.map((activity, index) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {getIcon(activity.entityType)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {activity.actor.name}
                            </span>
                            {getActionIcon(activity.action)}
                            <span className="text-gray-600 dark:text-gray-400">
                              {activity.action}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {activity.entityType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                          {formatTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
