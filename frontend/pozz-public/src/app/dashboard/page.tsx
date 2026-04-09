"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FundraisingProgress } from "@/components/fundraising-progress"
import { Users, TrendingUp, Calendar, Target, ArrowUp, ArrowDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { investorsService } from "@/lib/services/investors"
import { meetingsService } from "@/lib/services/meetings"
import { distributionService } from "@/lib/services/distribution"
import { LoadingSpinner } from "@/components/loading-states"
import { ErrorMessage } from "@/components/error-states"
import type { Investor, Meeting, DistributionPlatform } from "@/lib/types/api"

const mockStats = [
  {
    name: "Total Investors",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Active Deals",
    value: "8",
    change: "+3",
    trend: "up",
    icon: Target,
  },
  {
    name: "Meetings This Week",
    value: "12",
    change: "-2",
    trend: "down",
    icon: Calendar,
  },
  {
    name: "Pipeline Value",
    value: "$2.4M",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
  },
]

const recentInvestors = [
  {
    name: "John Smith",
    company: "Acme Ventures",
    status: "Meeting",
    source: "AngelList",
    date: "2 hours ago",
  },
  {
    name: "Sarah Johnson",
    company: "Tech Capital",
    status: "Negotiation",
    source: "LinkedIn",
    date: "5 hours ago",
  },
  {
    name: "Mike Wilson",
    company: "Future Fund",
    status: "Lead",
    source: "Twitter",
    date: "1 day ago",
  },
  {
    name: "Emily Davis",
    company: "Growth Partners",
    status: "Contacted",
    source: "Email",
    date: "2 days ago",
  },
]

const upcomingMeetings = [
  {
    investor: "John Smith",
    company: "Acme Ventures",
    time: "Today, 2:00 PM",
    type: "Video Call",
  },
  {
    investor: "Sarah Johnson",
    company: "Tech Capital",
    time: "Tomorrow, 10:00 AM",
    type: "In Person",
  },
  {
    investor: "David Lee",
    company: "Seed Investors",
    time: "Friday, 3:00 PM",
    type: "Video Call",
  },
]

const platformPerformance = [
  { platform: "AngelList", investors: 18, deals: 3, conversion: "16.7%" },
  { platform: "LinkedIn", investors: 15, deals: 2, conversion: "13.3%" },
  { platform: "Twitter", investors: 8, deals: 1, conversion: "12.5%" },
  { platform: "Email", investors: 6, deals: 2, conversion: "33.3%" },
]

export default function DashboardPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [platforms, setPlatforms] = useState<DistributionPlatform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [investorsRes, meetingsRes, platformsRes] = await Promise.all([
        investorsService.getAll({ page: 1, pageSize: 10 }),
        meetingsService.getUpcoming(),
        distributionService.getAll({ page: 1, pageSize: 10 }),
      ])

      setInvestors(investorsRes.data)
      setMeetings(meetingsRes)
      setPlatforms(platformsRes.data)
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err)
      setError(err.message || "Failed to load dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Calculate stats
  const totalInvestors = investors.length
  const activeDeals = 8 // Placeholder since we removed pipeline service
  const upcomingMeetingsCount = meetings.filter(m => m.status === "Scheduled").length
  const pipelineValue = 2400000 // Placeholder

  // Recent investors (last 4)
  const recentInvestors = investors.slice(0, 4)

  // Upcoming meetings (next 3)
  const upcomingMeetings = meetings.slice(0, 3)

  // Platform performance (top 4)
  const platformPerformance = platforms.slice(0, 4)

  const stats = [
    {
      name: "Total Investors",
      value: totalInvestors.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      name: "Active Deals",
      value: activeDeals.toString(),
      change: "+3",
      trend: "up",
      icon: Target,
    },
    {
      name: "Meetings This Week",
      value: upcomingMeetingsCount.toString(),
      change: "-2",
      trend: "down",
      icon: Calendar,
    },
    {
      name: "Pipeline Value",
      value: `$${(pipelineValue / 1000000).toFixed(1)}M`,
      change: "+18%",
      trend: "up",
      icon: TrendingUp,
    },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message={error} onRetry={loadDashboardData} />
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
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, Sarah. Here's your fundraising overview.
            </p>
          </div>
          <Button asChild className="shadow-lg shadow-red-600/20">
            <Link href="/dashboard/investors/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Investor
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-600/5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-600 dark:text-red-500" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.name}
                </div>
              </div>
            )
          })}
        </div>
        {/* Fundraising Progress Tracker */}
        <FundraisingProgress />
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Investors */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Investors
              </h2>
              <Link
                href="/dashboard/investors"
                className="text-sm text-red-600 dark:text-red-500 hover:underline font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentInvestors.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No investors yet. Start adding investors to see them here.
                </p>
              ) : (
                recentInvestors.map((investor) => (
                  <div
                    key={investor.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-medium">
                        {investor.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {investor.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {investor.company || "No company"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500">
                        {investor.status}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {investor.source || "Direct"} • {new Date(investor.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upcoming Meetings
              </h2>
              <Link
                href="/dashboard/meetings"
                className="text-sm text-red-600 dark:text-red-500 hover:underline font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMeetings.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                  No upcoming meetings scheduled.
                </p>
              ) : (
                upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-600 transition-all"
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {meeting.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {meeting.title || "No title"}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        {new Date(meeting.date).toLocaleDateString()}
                      </span>
                      <span className="text-red-600 dark:text-red-500 font-medium">
                        {meeting.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Platform Performance
            </h2>
            <Link
              href="/dashboard/distribution"
              className="text-sm text-red-600 dark:text-red-500 hover:underline font-medium"
            >
              View details
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Platform
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Investors
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Deals
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody>
                {platformPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No platforms added yet.
                    </td>
                  </tr>
                ) : (
                  platformPerformance.map((platform) => (
                    <tr
                      key={platform.id}
                      className="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {platform.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">
                        {platform.investors || 0}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">
                        {platform.deals || 0}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500">
                          {platform.conversion || "0%"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
