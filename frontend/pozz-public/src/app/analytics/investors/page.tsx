"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DonutChart } from "@/components/charts/donut-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { Users, TrendingUp, Target, Award, MapPin, Briefcase, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const investorsByStage = [
  { label: "Angel", value: 18, color: "#3b82f6" },
  { label: "Seed VC", value: 15, color: "#8b5cf6" },
  { label: "Series A", value: 9, color: "#f59e0b" },
  { label: "Corporate", value: 5, color: "#10b981" },
]

const investorsByLocation = [
  { label: "San Francisco", value: 14 },
  { label: "New York", value: 12 },
  { label: "Austin", value: 8 },
  { label: "Boston", value: 7 },
  { label: "Seattle", value: 6 },
]

const investorsBySector = [
  { label: "SaaS", value: 22, color: "#dc2626" },
  { label: "FinTech", value: 12, color: "#3b82f6" },
  { label: "AI/ML", value: 8, color: "#8b5cf6" },
  { label: "Healthcare", value: 5, color: "#10b981" },
]

const engagementOverTime = [
  { label: "Jan", value: 45 },
  { label: "Feb", value: 62 },
  { label: "Mar", value: 78 },
  { label: "Apr", value: 85 },
  { label: "May", value: 92 },
  { label: "Jun", value: 98 },
]

const topInvestors = [
  {
    name: "Sarah Johnson",
    company: "Tech Capital",
    dealSize: "$2M",
    meetings: 5,
    status: "Negotiation",
    engagement: 95,
  },
  {
    name: "John Smith",
    company: "Acme Ventures",
    dealSize: "$1.5M",
    meetings: 4,
    status: "Meeting",
    engagement: 88,
  },
  {
    name: "Emily Davis",
    company: "Growth Partners",
    dealSize: "$1.2M",
    meetings: 3,
    status: "Meeting",
    engagement: 82,
  },
  {
    name: "David Lee",
    company: "Seed Investors",
    dealSize: "$800K",
    meetings: 4,
    status: "Meeting",
    engagement: 76,
  },
  {
    name: "Lisa Chen",
    company: "Innovation Capital",
    dealSize: "$3M",
    meetings: 2,
    status: "Negotiation",
    engagement: 91,
  },
]

const investorMetrics = [
  { metric: "Average Response Time", value: "2.4 hours", trend: "down", change: "-12%" },
  { metric: "Meeting Success Rate", value: "80%", trend: "up", change: "+5%" },
  { metric: "Follow-up Rate", value: "94%", trend: "up", change: "+3%" },
  { metric: "Average Deal Cycle", value: "45 days", trend: "down", change: "-8%" },
]

export default function InvestorInsightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Investor Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Deep dive into investor relationships and engagement
            </p>
          </div>
          <Button className="shadow-lg shadow-red-600/20">
            <Download className="w-4 h-4 mr-2" />
            Export Insights
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              47
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Investors
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-600/10 dark:bg-green-600/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +18%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              $1.1M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Investment
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +5%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              85%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Engagement Rate
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                +3
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              8
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hot Leads
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investors by Stage */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Investors by Stage
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distribution across investment stages
              </p>
            </div>
            <DonutChart data={investorsByStage} size={200} />
          </div>

          {/* Investors by Sector Focus */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Sector Focus
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Investor preferences by industry
              </p>
            </div>
            <DonutChart data={investorsBySector} size={200} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Geographic Distribution
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Top investor locations
              </p>
            </div>
            <BarChart 
              data={investorsByLocation.map(d => ({ ...d, color: "#dc2626" }))} 
              height={250} 
            />
          </div>

          {/* Engagement Over Time */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Engagement Score Trend
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average engagement over time
              </p>
            </div>
            <LineChart data={engagementOverTime} height={250} color="#8b5cf6" />
          </div>
        </div>

        {/* Top Investors Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Top Engaged Investors
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Investor
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Deal Size
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Meetings
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {topInvestors.map((investor, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-medium text-sm">
                          {investor.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {investor.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {investor.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {investor.dealSize}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center font-medium text-gray-900 dark:text-white">
                        {investor.meetings}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        investor.status === "Negotiation"
                          ? "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-500"
                          : "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500"
                      }`}>
                        {investor.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex-1 max-w-[100px]">
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                investor.engagement >= 90
                                  ? "bg-green-600"
                                  : investor.engagement >= 80
                                  ? "bg-blue-600"
                                  : "bg-yellow-600"
                              }`}
                              style={{ width: `${investor.engagement}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white w-10 text-right">
                          {investor.engagement}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investor Metrics */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Relationship Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.metric}
                </div>
                <div className={`text-sm font-medium ${
                  item.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <Briefcase className="w-8 h-8 text-red-600 dark:text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              SaaS Focused
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-bold text-red-600">47%</span> of investors specialize in SaaS, aligning with your product
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              SF Bay Area Lead
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-bold text-blue-600">30%</span> of investors based in San Francisco, your primary market
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800 rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-500 mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Strong Engagement
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-bold text-green-600">85%</span> engagement rate, up 5% from last quarter
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
