"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { DonutChart } from "@/components/charts/donut-chart"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/services/analytics"
import { LoadingSpinner } from "@/components/loading-states"
import { ErrorMessage } from "@/components/error-states"

// Mock data for charts (as fallback)
const mockInvestorGrowthData = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 18 },
  { label: "Mar", value: 25 },
  { label: "Apr", value: 32 },
  { label: "May", value: 38 },
  { label: "Jun", value: 47 },
]

const mockDealStageData = [
  { label: "Lead", value: 8, color: "#6b7280" },
  { label: "Contacted", value: 5, color: "#3b82f6" },
  { label: "Meeting", value: 4, color: "#8b5cf6" },
  { label: "Negotiation", value: 2, color: "#f59e0b" },
  { label: "Closed", value: 3, color: "#10b981" },
]

const mockSourceDistribution = [
  { label: "AngelList", value: 18, color: "#dc2626" },
  { label: "LinkedIn", value: 15, color: "#0a66c2" },
  { label: "Twitter", value: 8, color: "#1da1f2" },
  { label: "Email", value: 6, color: "#ea4335" },
]

const mockMonthlyActivity = [
  { label: "Jan", value: 24 },
  { label: "Feb", value: 31 },
  { label: "Mar", value: 28 },
  { label: "Apr", value: 35 },
  { label: "May", value: 42 },
  { label: "Jun", value: 38 },
]

const mockConversionMetrics = [
  { label: "Lead to Contact", value: 62.5 },
  { label: "Contact to Meeting", value: 80 },
  { label: "Meeting to Negotiation", value: 50 },
  { label: "Negotiation to Close", value: 75 },
]

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months ago
    end: new Date().toISOString().split('T')[0] // today
  })

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await analyticsService.getDashboard()
      setAnalyticsData(data)
    } catch (err: any) {
      console.error("Failed to load analytics:", err)
      setError(err.message || "Failed to load analytics")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const handleExport = async () => {
    try {
      const report = await analyticsService.exportData("csv")
      const blob = new Blob([report as any], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analytics-report-${dateRange.start}-to-${dateRange.end}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || "Failed to export report")
    }
  }

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
        <ErrorMessage message={error} onRetry={loadAnalytics} />
      </DashboardLayout>
    )
  }

  // Use analytics data or fall back to mock data
  const investorGrowthData = analyticsData?.investorGrowth || mockInvestorGrowthData
  const dealStageData = analyticsData?.dealStages || mockDealStageData
  const sourceDistribution = analyticsData?.sources || mockSourceDistribution
  const monthlyActivity = analyticsData?.monthlyActivity || mockMonthlyActivity
  const conversionMetrics = analyticsData?.conversionRates || mockConversionMetrics

  // KPI values
  const totalPipelineValue = analyticsData?.totalPipelineValue || 2400000
  const totalInvestors = analyticsData?.totalInvestors || 47
  const activeDeals = analyticsData?.activeDeals || 8
  const meetingsThisWeek = analyticsData?.meetingsThisWeek || 12

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your fundraising performance and insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button onClick={handleExport} className="shadow-lg shadow-red-600/20">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-600/10 dark:bg-green-600/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +32%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ${(totalPipelineValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Pipeline Value
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +12%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {totalInvestors}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Investors
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +3
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {activeDeals}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Deals
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-600/10 dark:bg-orange-600/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-500">
                -2
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {meetingsThisWeek}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Meetings This Week
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investor Growth */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Investor Growth
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total investors over time
              </p>
            </div>
            <LineChart data={investorGrowthData} height={250} color="#dc2626" />
          </div>

          {/* Deal Pipeline by Stage */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Pipeline by Stage
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distribution across deal stages
              </p>
            </div>
            <BarChart data={dealStageData} height={250} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Distribution */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Investor Sources
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Where your investors come from
              </p>
            </div>
            <DonutChart data={sourceDistribution} size={200} />
          </div>

          {/* Monthly Activity */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Monthly Activity
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total meetings per month
              </p>
            </div>
            <BarChart 
              data={monthlyActivity.map((d: any) => ({ ...d, color: "#dc2626" }))} 
              height={250} 
            />
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Conversion Funnel
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Success rate at each stage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {conversionMetrics.map((metric: any, index: number) => (
              <div key={index} className="relative">
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 rounded-xl border-2 border-red-200 dark:border-red-800">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-500 mb-2">
                    {metric.value}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </div>
                </div>
                {index < conversionMetrics.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-1/2">
                    <div className="w-4 h-4 border-t-2 border-r-2 border-gray-300 dark:border-gray-700 rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800 rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Best Performing Source
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-bold text-green-600">AngelList</span> with 18 investors
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              16.7% conversion rate
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Average Deal Size
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-bold text-blue-600">$1.1M</span> per investor
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +18% from last quarter
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
            <Target className="w-8 h-8 text-purple-600 dark:text-purple-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Success Rate
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-bold text-purple-600">37.5%</span> meeting to close
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Industry average: 25%
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
