"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { DollarSign, TrendingUp, Target, Percent, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const monthlyFundraisingData = [
  { label: "Jan", value: 250000 },
  { label: "Feb", value: 420000 },
  { label: "Mar", value: 580000 },
  { label: "Apr", value: 750000 },
  { label: "May", value: 980000 },
  { label: "Jun", value: 1200000 },
]

const dealSizeDistribution = [
  { label: "<$250K", value: 8, color: "#6b7280" },
  { label: "$250K-$500K", value: 12, color: "#3b82f6" },
  { label: "$500K-$1M", value: 15, color: "#8b5cf6" },
  { label: "$1M-$2M", value: 9, color: "#f59e0b" },
  { label: ">$2M", value: 3, color: "#10b981" },
]

const burnRateData = [
  { label: "Jan", value: 85000 },
  { label: "Feb", value: 92000 },
  { label: "Mar", value: 88000 },
  { label: "Apr", value: 95000 },
  { label: "May", value: 91000 },
  { label: "Jun", value: 89000 },
]

const milestones = [
  {
    target: "$2M Series A",
    current: "$1.2M",
    percentage: 60,
    deadline: "Dec 2026",
    status: "On Track",
  },
  {
    target: "50 Investors",
    current: "47",
    percentage: 94,
    deadline: "Aug 2026",
    status: "Ahead",
  },
  {
    target: "$3M ARR",
    current: "$2.1M",
    percentage: 70,
    deadline: "Oct 2026",
    status: "On Track",
  },
]

const cashflowProjections = [
  { month: "Jul", income: 180000, expenses: 92000, net: 88000 },
  { month: "Aug", income: 220000, expenses: 95000, net: 125000 },
  { month: "Sep", income: 185000, expenses: 88000, net: 97000 },
  { month: "Oct", income: 250000, expenses: 91000, net: 159000 },
  { month: "Nov", income: 195000, expenses: 89000, net: 106000 },
  { month: "Dec", income: 280000, expenses: 93000, net: 187000 },
]

export default function FinancialAnalyticsPage() {
  const totalRaised = 1200000
  const targetAmount = 2000000
  const progress = (totalRaised / targetAmount) * 100

  const avgDealSize = 1100000
  const burnRate = 89000
  const runway = 18.5

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Financial Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track fundraising progress and financial metrics
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Download className="w-4 h-4 mr-2" />
            Export Financial Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-600/10 dark:bg-green-600/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +$280K
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ${(totalRaised / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Raised
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Target: $2M</span>
                <span className="font-medium text-gray-900 dark:text-white">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ${(avgDealSize / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Deal Size
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              +18% from last quarter
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              ${(burnRate / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Monthly Burn Rate
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              -3% from last month
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {runway}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Months Runway
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              At current burn rate
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fundraising Progress */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Fundraising Progress
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cumulative amount raised over time
              </p>
            </div>
            <LineChart data={monthlyFundraisingData} height={250} color="#10b981" />
          </div>

          {/* Deal Size Distribution */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Deal Size Distribution
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Number of deals by investment range
              </p>
            </div>
            <BarChart data={dealSizeDistribution} height={250} />
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Fundraising Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {milestone.target}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    milestone.status === "Ahead"
                      ? "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-500"
                      : "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500"
                  }`}>
                    {milestone.status}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Current: <span className="font-medium text-gray-900 dark:text-white">{milestone.current}</span>
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {milestone.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all"
                      style={{ width: `${milestone.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Deadline: {milestone.deadline}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Burn Rate Trend */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Monthly Burn Rate
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Operating expenses per month
              </p>
            </div>
            <LineChart 
              data={burnRateData.map(d => ({ ...d, value: d.value / 1000 }))} 
              height={250} 
              color="#dc2626" 
            />
          </div>

          {/* Cashflow Projections */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Cashflow Projections
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next 6 months forecast
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Month</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Income</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {cashflowProjections.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                      <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                      <td className="py-3 text-sm text-right text-green-600 dark:text-green-500">
                        ${(row.income / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 text-sm text-right text-red-600 dark:text-red-500">
                        ${(row.expenses / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                        ${(row.net / 1000).toFixed(0)}K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800 rounded-2xl p-6">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Strong Momentum
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Raised <span className="font-bold text-green-600">$1.2M</span> in Q2, 60% of Series A target with 6 months remaining
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <Percent className="w-8 h-8 text-blue-600 dark:text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Healthy Burn
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-bold text-blue-600">$89K</span> monthly burn rate, down 3% with 18.5 months runway
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
            <Target className="w-8 h-8 text-purple-600 dark:text-purple-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              On Target
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              All milestones tracking <span className="font-bold text-purple-600">on or ahead</span> of schedule
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
