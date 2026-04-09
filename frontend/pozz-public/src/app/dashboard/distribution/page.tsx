"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, ExternalLink, TrendingUp, Eye, MousePointerClick, Users, BarChart3, Link as LinkIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { distributionService } from "@/lib/services/distribution"
import { LoadingSpinner } from "@/components/loading-states"
import { ErrorMessage, EmptyState } from "@/components/error-states"
import type { DistributionPlatform } from "@/lib/types/api"

const mockPlatforms = [
  {
    id: 1,
    name: "AngelList",
    url: "https://angel.co/company/pozz-io",
    status: "Active",
    views: 1247,
    clicks: 89,
    investors: 18,
    deals: 3,
    conversion: "16.7%",
    lastUpdated: "2 hours ago",
    performance: "high",
  },
  {
    id: 2,
    name: "LinkedIn",
    url: "https://linkedin.com/company/pozz",
    status: "Active",
    views: 2103,
    clicks: 142,
    investors: 15,
    deals: 2,
    conversion: "13.3%",
    lastUpdated: "5 hours ago",
    performance: "high",
  },
  {
    id: 3,
    name: "Twitter/X",
    url: "https://twitter.com/pozz_io",
    status: "Active",
    views: 856,
    clicks: 67,
    investors: 8,
    deals: 1,
    conversion: "12.5%",
    lastUpdated: "1 day ago",
    performance: "medium",
  },
  {
    id: 4,
    name: "Crunchbase",
    url: "https://crunchbase.com/organization/pozz",
    status: "Active",
    views: 643,
    clicks: 34,
    investors: 4,
    deals: 0,
    conversion: "0%",
    lastUpdated: "2 days ago",
    performance: "low",
  },
  {
    id: 5,
    name: "Product Hunt",
    url: "https://producthunt.com/posts/pozz",
    status: "Active",
    views: 1892,
    clicks: 156,
    investors: 6,
    deals: 2,
    conversion: "33.3%",
    lastUpdated: "3 days ago",
    performance: "high",
  },
  {
    id: 6,
    name: "Email Campaign",
    url: "Internal - Newsletter",
    status: "Active",
    views: 534,
    clicks: 89,
    investors: 6,
    deals: 2,
    conversion: "33.3%",
    lastUpdated: "1 week ago",
    performance: "high",
  },
]

const recentActivity = [
  {
    platform: "LinkedIn",
    type: "New Investor",
    investor: "Sarah Johnson",
    time: "2 hours ago",
  },
  {
    platform: "AngelList",
    type: "Profile View",
    count: 45,
    time: "5 hours ago",
  },
  {
    platform: "Twitter/X",
    type: "New Investor",
    investor: "Mike Wilson",
    time: "1 day ago",
  },
  {
    platform: "Email Campaign",
    type: "Click Through",
    count: 12,
    time: "2 days ago",
  },
  {
    platform: "Product Hunt",
    type: "New Investor",
    investor: "Emily Davis",
    time: "3 days ago",
  },
]

export default function DistributionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [platforms, setPlatforms] = useState<DistributionPlatform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPlatforms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await distributionService.getAll({ page: 1, pageSize: 50 })
      setPlatforms(response.data)
    } catch (err: any) {
      console.error("Failed to load platforms:", err)
      setError(err.message || "Failed to load distribution platforms")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPlatforms()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this platform?")) return
    
    try {
      await distributionService.delete(id)
      await loadPlatforms()
    } catch (err: any) {
      alert(err.message || "Failed to delete platform")
    }
  }

  const handleSync = async (id: string) => {
    try {
      await distributionService.sync(id)
      await loadPlatforms()
    } catch (err: any) {
      alert(err.message || "Failed to sync platform")
    }
  }

  const totalViews = platforms.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalClicks = platforms.reduce((sum, p) => sum + (p.clicks || 0), 0)
  const totalInvestors = platforms.reduce((sum, p) => sum + (p.investors || 0), 0)
  const avgConversion = totalViews > 0 ? ((totalInvestors / totalViews) * 100).toFixed(1) : "0.0"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Distribution
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track where your project is shared and measure engagement
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Views</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalViews.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalClicks.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Investors</span>
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">
              {totalInvestors}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Conversion</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {avgConversion}%
            </div>
          </div>
        </div>

        {/* Platforms Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadPlatforms} />
        ) : platforms.length === 0 ? (
          <EmptyState
            title="No platforms added"
            message="Start tracking your distribution by adding platforms"
          />
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl">
              Distribution Platforms
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Platform
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Views
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Clicks
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Investors
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Deals
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conversion
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((platform) => (
                  <tr
                    key={platform.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {platform.name}
                          {platform.performance === "high" && (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {platform.url}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Updated {platform.lastUpdated}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        platform.status === "Active"
                          ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500"
                          : "bg-gray-600/10 dark:bg-gray-600/20 text-gray-600 dark:text-gray-500"
                      }`}>
                        {platform.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {platform.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {platform.clicks}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-medium text-red-600 dark:text-red-500">
                        {platform.investors}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {platform.deals}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        platform.performance === "high"
                          ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500"
                          : platform.performance === "medium"
                          ? "bg-yellow-600/10 dark:bg-yellow-600/20 text-yellow-600 dark:text-yellow-500"
                          : "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500"
                      }`}>
                        {platform.conversion}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSync(platform.id)}
                          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                          title="Sync platform data"
                        >
                          <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                          title="Visit platform"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </a>
                        <button
                          onClick={() => handleDelete(platform.id)}
                          className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center justify-center transition-all"
                          title="Remove platform"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center shrink-0">
                    {activity.type === "New Investor" && <Users className="w-5 h-5 text-red-600 dark:text-red-500" />}
                    {activity.type === "Profile View" && <Eye className="w-5 h-5 text-red-600 dark:text-red-500" />}
                    {activity.type === "Click Through" && <MousePointerClick className="w-5 h-5 text-red-600 dark:text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {activity.type}
                      {activity.investor && (
                        <span className="text-red-600 dark:text-red-500"> - {activity.investor}</span>
                      )}
                      {activity.count && (
                        <span className="text-red-600 dark:text-red-500"> ({activity.count} views)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.platform} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Platforms */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">
              Top Performers
            </h2>
            <div className="space-y-4">
              {platforms
                .sort((a, b) => b.investors - a.investors)
                .slice(0, 5)
                .map((platform, index) => (
                  <div key={platform.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {platform.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {platform.investors} investors • {platform.conversion} conversion
                      </div>
                    </div>
                    <TrendingUp className={`w-4 h-4 ${
                      platform.performance === "high"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`} />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <BarChart3 className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Analytics Report
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate detailed performance reports
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <LinkIcon className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              UTM Tracking
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create trackable campaign links
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-all cursor-pointer">
            <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Attribution
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See which platforms drive the most deals
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
